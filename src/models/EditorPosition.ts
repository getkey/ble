import { types, getRoot } from 'mobx-state-tree';
import { Point as PixiPoint } from 'pixi.js';

import Point from 'src/models/Point';
import GenericPoint from 'src/types/point';
import { EditorMode } from 'src/types/editor';
import { IRootStore } from 'src/models/RootStore';

const EditorPosition = types.model({
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
	renderZone: types.optional(
		types.model({
			x: 0,
			y: 0,
			width: types.number,
			height: types.number,
		}),
		{
			width: window.innerWidth,
			height: window.innerHeight,
		}
	),
}).actions((self) => ({
	setScale(scale: number): void {
		self.scale = scale;
	},
	setMode(mode: EditorMode): void {
		self.mode = mode;
	},
	setPanning(panning: boolean): void {
		const root: IRootStore = getRoot(self);
		root.undoManager.withoutUndo(() => {
			self.panning = panning;
		});
	},
	setScreenSize({ width, height, x, y }: { width: number; height: number; x: number; y: number; }): void {
		const root: IRootStore = getRoot(self);
		root.undoManager.withoutUndo(() => {
			self.renderZone.width = width;
			self.renderZone.height = height;
			self.renderZone.x = x;
			self.renderZone.y = y;
		});
	},
})).views((self) => ({
	get cameraPos(): GenericPoint {
		return {
			x: Math.round(self.renderZone.width/2),
			y: Math.round(self.renderZone.height/2),
		};
	},
	get globalCursor(): string {
		switch(self.mode) {
			case EditorMode.pan:
				return self.panning ? 'grabbing' : 'grab';
			case EditorMode.addBlock:
			case EditorMode.addVertex:
				return 'crosshair';
		}

		return 'auto';
	},
	get scaleAsPixiPoint(): PixiPoint {
		return new PixiPoint(self.scale, self.scale);
	},
})).views((self) => ({
	screenToWorld(screenPos: GenericPoint): GenericPoint {
		return {
			x: self.position.x + (screenPos.x - self.cameraPos.x) * (1/self.scale),
			y: self.position.y + (screenPos.y - self.cameraPos.y) * (1/self.scale),
		};
	},
}));

export default EditorPosition;
