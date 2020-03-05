import { types } from 'mobx-state-tree';
import { Point as PixiPoint } from 'pixi.js';

import Point, { IPoint } from 'src/models/Point';
import GenericPoint from 'src/types/point';
import { EditorMode } from 'src/types/editor';
import { EntityType } from 'src/types/entity';
import Entity, { IEntity } from 'src/models/Entity';

function getCameraPos(): GenericPoint {
	// TODO: store the camera pos in the store
	return {
		x: 0,
		y: 0,
	};
}

const Editor = types.model({
	position: Point,
	scale: 1,
	mode: types.enumeration(Object.values(EditorMode)),
	panning: false,
	gridCellSize: 60,
	selectedEntity: types.union(
		types.safeReference(Entity),
		types.safeReference(Point),
	),
	addType: types.enumeration(Object.values(EntityType)),
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
	setSelectedEntity(selected: IEntity | IPoint | undefined): void {
		self.selectedEntity = selected;
	},
	setAddType(addType: EntityType): void {
		self.addType = addType;
	},
})).views((self) => ({
	screenToWorld(screenPos: GenericPoint): GenericPoint {
		const cameraPos = getCameraPos();

		return {
			x: self.position.x + (screenPos.x - cameraPos.x) * (1/self.scale),
			y: self.position.y + (screenPos.y - cameraPos.y) * (1/self.scale),
		};
	},
	get scaleAsPixiPoint(): PixiPoint {
		return new PixiPoint(self.scale, self.scale);
	},
}));
export default Editor;
