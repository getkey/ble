import { types, getRoot, detach } from 'mobx-state-tree';

import Entity, { IEntity } from 'src/models/Entity';
import Vertex, { IVertex } from 'src/models/Vertex';
import Block from 'src/models/Block';
import { IRootStore } from 'src/models/RootStore';
import { cloneEntity } from 'src/utils/clone';
import { EditorMode } from 'src/types/editor';
import VerticesParams from 'src/models/VerticesParams';

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
}).actions((self) => ({
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
		if (VerticesParams.is(entity.params)) {
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
			if (!VerticesParams.is(entity.params)) return;
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
		if (self.selection.size === 1 && Block.is(Array.from(self.selection.values())[0])) {
			return Object.values(EditorMode);
		}

		return Object.values(EditorMode).filter((mode) => mode !== EditorMode.addVertex);
	},
}));
export default EditorSelection;
