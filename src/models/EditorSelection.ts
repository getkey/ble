import { types, getRoot, detach, getSnapshot } from 'mobx-state-tree';
import { Polygon, Box, Vector } from 'sat';

import Entity, { IEntity } from 'src/models/Entity';
import Vertex, { IVertex } from 'src/models/Vertex';
import Point from 'src/models/Point';
import { IRootStore } from 'src/models/RootStore';
import { cloneEntity } from 'src/utils/clone';
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
	clipboard: types.map(Entity),
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
	clearClipboard(): void {
		self.clipboard.clear();
	},
	addToSelection(selected: IEntity): void {
		self.selection.put(selected);
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
	setClipboard(copied: Array<IEntity>): void {
		self.clearClipboard();
		copied.forEach((thing) => self.clipboard.put(thing));
	},
	addVertexToSelection(vertex: IVertex): void {
		self.addToSelection(vertex.parentBlock);
		self.vertexSelection.put(vertex);
	},
})).actions((self) => ({
	setSelection(selected: Array<IEntity>): void {
		self.clearSelection();
		selected.forEach((thing) => self.addToSelection(thing));
	},
	setVertexSelection(vertices: Array<IVertex>): void {
		self.vertexSelection.clear();
		vertices.forEach((vertex) => {
			self.addVertexToSelection(vertex);
		});
	},
	copy(): void {
		// store a copy, not a reference so the original entity can be moved, etc
		const copies = Array.from(self.selection.values())
			.map((entity) => cloneEntity(entity));

		const processedEntities = copies.map((entity) => entityPostProcessor(getSnapshot(entity)));
		serializePrefab(processedEntities).then((lel) => {
			navigator.clipboard.writeText(lel);
			const sup = deserializePrefab(lel).then((kek) => console.log(kek));
			console.log('sup', lel, sup);
		});
		self.setClipboard(copies);
	},
	paste(): void {
		const tmpClipboard = Array.from(self.clipboard.values());
		tmpClipboard.forEach((entity) => {
			detach(entity);
			entity.params.move(self.gridCellSize, self.gridCellSize);
		});
		const root: IRootStore = getRoot(self);

		self.clearClipboard();
		self.clearSelection();

		root.addEntities(tmpClipboard);

		const newClipboard = tmpClipboard.map((entity) => cloneEntity(entity));
		self.setClipboard(newClipboard);
	},
})).actions((self) => ({
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
