import { types, getRoot, getSnapshot } from 'mobx-state-tree';
import { Polygon, Box, Vector } from 'sat';
import { centerEntities }  from 'bombhopperio-level-tools';
import { toast } from 'react-toastify';

import Entity, { IEntity, SnapshotOutEntity } from 'src/models/Entity';
import Vertex, { IVertex } from 'src/models/Vertex';
import Point from 'src/models/Point';
import { IRootStore } from 'src/models/RootStore';
import { EditorMode } from 'src/types/editor';
import GenericPoint from 'src/types/point';
import { entityPostProcessor } from 'src/utils/snapshot';
import { serializePrefab, deserializePrefab } from 'src/utils/serialization';

const EditorSelection = types.model({
	gridCellSize: 60,
	selection: types.map(
		types.safeReference(Entity, {
			acceptsUndefined: false,
		})
	),
	vertexSelection: types.map(
		types.safeReference(Vertex, {
			acceptsUndefined: false,
		}),
	),
	selectionBox: types.maybe(types.model({
		start: Point,
		end: Point,
	})),
}).actions((self) => ({
	startSelectionBox(pos: GenericPoint): void {
		self.selectionBox = {
			start: Point.create(pos),
			end: Point.create(pos),
		};
	},
	updateSelectionBox(pos: GenericPoint): void {
		if (self.selectionBox === undefined) return;

		self.selectionBox.end.set(pos.x, pos.y);
	},
	endSelectionBox(): void {
		self.selectionBox = undefined;
	},
	setGridCellSize(cellSize: number): void {
		self.gridCellSize = cellSize;
	},
	addEntityToSelection(entity: IEntity): void {
		self.selection.put(entity);
	},
	removeFromSelection(entity: IEntity): void {
		if ('vertices' in entity.params) {
			entity.params.vertices.forEach((vertex) => {
				self.vertexSelection.delete(vertex.id);
			});
			entity.params.cleanInvalid();
		}

		self.selection.delete(entity.id);
	},
	removeVertexFromSelection(vertex: IVertex): void {
		self.vertexSelection.delete(vertex.id);
	},
	clearVertexSelection(): void {
		self.vertexSelection.clear();
	},
	removeSelected(): void {
		self.selection.forEach((thing) => thing.remove());
	},
})).actions((self) => ({
	clearSelection(): void {
		self.clearVertexSelection();
		self.selection.forEach((entity) => {
			if (!('vertices' in entity.params)) return;
			entity.params.cleanInvalid();
		});
		self.selection.clear();
	},
	addVertexToSelection(vertex: IVertex): void {
		self.addEntityToSelection(vertex.parentBlock);
		self.vertexSelection.put(vertex);
	},
})).actions((self) => ({
	addEntitiesToSelection(entities: Array<IEntity>): void {
		entities.forEach((entity) => self.addEntityToSelection(entity));
	},
	setVertexSelection(vertices: Array<IVertex>): void {
		self.vertexSelection.clear();
		vertices.forEach((vertex) => {
			self.addVertexToSelection(vertex);
		});
	},
	copy(): void {
		const processedEntities = Array.from(self.selection.values())
			.map((entity) => entityPostProcessor(getSnapshot<SnapshotOutEntity>(entity)));

		serializePrefab(processedEntities).then((prefab: string) => {
			toast.success('Copied!', {
				autoClose: 1000,
			});
			navigator.clipboard.writeText(prefab);
		});
	},
	paste(clipboardContent: string): void {
		const root: IRootStore = getRoot(self);

		deserializePrefab(clipboardContent.trim()).then((prefab) => {
			const gridSnappedCenter = {
				x: Math.round(root.editor.position.x / root.editor.gridCellSize) * root.editor.gridCellSize,
				y: Math.round(root.editor.position.y / root.editor.gridCellSize) * root.editor.gridCellSize,
			};
			const entities = centerEntities(prefab, gridSnappedCenter)
				.map((entitySnapshot) => Entity.create(entitySnapshot));
			root.addEntities(entities);
		}).catch((err) => {
			// eslint-disable-next-line no-console
			console.error('Couldn\'t paste prefab.', err);
		});
	},
})).actions((self) => ({
	setSelection(entities: Array<IEntity>): void {
		self.clearSelection();
		self.addEntitiesToSelection(entities);
	},
	cut(): void {
		self.copy();
		self.removeSelected();
	},
})).views((self) => ({
	get availableModes(): Array<EditorMode> {
		if (self.selection.size === 1 && 'vertices' in Array.from(self.selection.values())[0].params) {
			return Object.values(EditorMode);
		}

		return Object.values(EditorMode).filter((mode) => mode !== EditorMode.addVertex);
	},
	get selectionAsAabb(): Box {
		const { topLeft, bottomRight } = Array.from(self.selection.values())
			.map(({ params }) => params.asAabb)
			.reduce(({ topLeft: topLeft_, bottomRight: bottomRight_ }, box) => {
				return {
					topLeft: {
						x: Math.min(topLeft_.x, box.pos.x),
						y: Math.min(topLeft_.y, box.pos.y),
					},
					bottomRight: {
						x: Math.max(bottomRight_.x, box.pos.x + box.w),
						y: Math.max(bottomRight_.y, box.pos.y + box.h),
					},
				};
			}, {
				topLeft: {
					x: Infinity,
					y: Infinity,
				},
				bottomRight: {
					x: -Infinity,
					y: -Infinity,
				},
			});

		return new Box(new Vector(topLeft.x, topLeft.y), bottomRight.x - topLeft.x, bottomRight.y - topLeft.y);
	},
	get selectionBoxAsSat(): Polygon | Vector {
		if (self.selectionBox === undefined) {
			return new Vector(Infinity, Infinity);
		}

		if (self.selectionBox.start.x === self.selectionBox.end.x && self.selectionBox.start.y === self.selectionBox.end.y) {
			// sat-js is buggy with polygons of width 0, so we need to return a vector
			return new Vector(self.selectionBox.start.x, self.selectionBox.start.y);
		}

		// negative width and height is not supported
		// which is why we need to do all this mumbo jumbo
		const topLeft = {
			x: Math.min(self.selectionBox.start.x, self.selectionBox.end.x),
			y: Math.min(self.selectionBox.start.y, self.selectionBox.end.y),
		};
		const bottomRight = {
			x: Math.max(self.selectionBox.start.x, self.selectionBox.end.x),
			y: Math.max(self.selectionBox.start.y, self.selectionBox.end.y),
		};

		return new Box(
			new Vector(
				topLeft.x,
				topLeft.y,
			),
			bottomRight.x - topLeft.x,
			bottomRight.y - topLeft.y,
		).toPolygon();
	},
}));
export default EditorSelection;
