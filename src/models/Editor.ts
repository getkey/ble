import { types } from 'mobx-state-tree';
import { Point as PixiPoint } from 'pixi.js';

import Point from 'src/models/Point';
import Vertex, { IVertex } from 'src/models/Vertex';
import GenericPoint from 'src/types/point';
import { EditorMode } from 'src/types/editor';
import { EntityType } from 'src/types/entity';
import Entity, { IEntity } from 'src/models/Entity';

const Editor = types.model({
	position: Point,
	scale: 1,
	mode: types.optional(
		types.enumeration(Object.values(EditorMode)),
		EditorMode.select,
	),
	panning: false,
	gridCellSize: 60,
	selectedEntity: types.union(
		types.safeReference(Entity),
		types.safeReference(Vertex),
	),
	addType: types.optional(
		types.enumeration(Object.values(EntityType)),
		EntityType.normal,
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
	setSelectedEntity(selected: IEntity | IVertex | undefined): void {
		self.selectedEntity = selected;
	},
	setAddType(addType: EntityType): void {
		self.addType = addType;
	},
	setScreenSize(width: number, height: number): void {
		self.screen.width = width;
		self.screen.height = height;
	},
	setFontLoaded(): void {
		self.fontLoaded = true;
	},
})).views((self) => ({
	get cameraPos(): GenericPoint {
		return {
			x: Math.round(self.screen.width/2),
			y: Math.round(self.screen.height/2),
		};
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
