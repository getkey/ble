import { types, getRoot, detach } from 'mobx-state-tree';
import { Point as PixiPoint } from 'pixi.js';

import Point from 'src/models/Point';
import Vertex, { IVertex } from 'src/models/Vertex';
import GenericPoint from 'src/types/point';
import { EditorMode } from 'src/types/editor';
import { AddType } from 'src/types/entity';
import Entity, { IEntity } from 'src/models/Entity';
import Block from 'src/models/Block';
import { IRootStore } from 'src/models/RootStore';
import { cloneEntity } from 'src/utils/clone';

const Editor = types.model({
	position: types.optional(Point, {
		x: 400,
		y: 600,
	}),
	scale: 1,
	mode: types.optional(
		types.enumeration(Object.values(EditorMode)),
		EditorMode.select,
	),
	panning: false,
	gridCellSize: 60,
	selection: types.map(
		types.union(
			types.safeReference(Entity, {
				acceptsUndefined: false,
				// TODO: onInvalidated remove it if it's invalid
			}),
			types.safeReference(Vertex, {
				acceptsUndefined: false,
			}),
		),
	),
	clipboard: types.map(Entity),
	addType: types.optional(
		types.enumeration(Object.values(AddType)),
		AddType.normalBlock,
	),
	screen: types.optional(
		types.model({
			width: types.number,
			height: types.number,
		}),
		{
			width: window.innerWidth,
			height: window.innerHeight,
		}
	),
	fontLoaded: false,
}).actions((self) => ({
	setScale(scale: number): void {
		self.scale = scale;
	},
	setMode(mode: EditorMode): void {
		self.mode = mode;
	},
	setPanning(panning: boolean): void {
		self.panning = panning;
	},
	setGridCellSize(cellSize: number): void {
		self.gridCellSize = cellSize;
	},
	setAddType(addType: AddType): void {
		self.addType = addType;
	},
	setScreenSize(width: number, height: number): void {
		self.screen.width = width;
		self.screen.height = height;
	},
	setFontLoaded(): void {
		self.fontLoaded = true;
	},
	clearClipboard(): void {
		self.clipboard.clear();
	},
	addToSelection(selected: IEntity | IVertex): void {
		self.selection.put(selected);
	},
	removeFromSelection(selected: IEntity | IVertex): void {
		self.selection.delete(selected.id);
		// TODO cleanup if entity is invalid
	},
	clearSelection(): void {
		self.selection.clear();
		// TODO cleanup if entity is invalid
	},
	removeSelected(): void {
		self.selection.forEach((thing) => thing.remove());
	},
})).actions((self) => ({
	setSelection(selected: Array<IEntity | IVertex>): void {
		self.clearSelection();
		selected.forEach((thing) => self.addToSelection(thing));
	},
	setClipboard(copied: Array<IEntity>): void {
		self.clearClipboard();
		copied.forEach((thing) => self.clipboard.put(thing));
	},
})).actions((self) => ({
	copy(): void {
		// store a copy, not a reference so the original entity can be moved, etc
		const copies = Array.from(self.selection.values())
			.filter((thing) => Entity.is(thing))
			.map((entity) => cloneEntity(entity as IEntity));
		self.setClipboard(copies);
	},
	paste(): void {
		const tmpClipboard = new Map(self.clipboard);
		tmpClipboard.forEach((entity) => {
			detach(entity);
		});
		const root: IRootStore = getRoot(self);

		self.clearClipboard();
		self.clearSelection();

		tmpClipboard.forEach((entity) => {
			entity.move(self.gridCellSize, self.gridCellSize);
			root.addEntity(entity);
			self.addToSelection(entity);
		});

		const newClipboard = Array.from(tmpClipboard.values()).map((entity) => cloneEntity(entity));
		self.setClipboard(newClipboard);
	},
})).actions((self) => ({
	cut(): void {
		self.copy();
		self.removeSelected();
	},
})).views((self) => ({
	get cameraPos(): GenericPoint {
		return {
			x: Math.round(self.screen.width/2),
			y: Math.round(self.screen.height/2),
		};
	},
	get globalCursor(): string {
		if (self.panning) return 'all-scroll';

		switch(self.mode) {
			case EditorMode.addBlock:
			case EditorMode.addVertex:
				return 'crosshair';
				break;
		}

		return 'auto';
	},
	get availableModes(): Array<EditorMode> {
		if (self.selection.size === 1 && Block.is(Array.from(self.selection.values())[0])) {
			return Object.values(EditorMode);
		}

		return Object.values(EditorMode).filter((mode) => mode !== EditorMode.addVertex);
	},
})).views((self) => ({
	screenToWorld(screenPos: GenericPoint): GenericPoint {
		return {
			x: self.position.x + (screenPos.x - self.cameraPos.x) * (1/self.scale),
			y: self.position.y + (screenPos.y - self.cameraPos.y) * (1/self.scale),
		};
	},
	get scaleAsPixiPoint(): PixiPoint {
		return new PixiPoint(self.scale, self.scale);
	},
}));
export default Editor;
