import { types, Instance } from 'mobx-state-tree';
import { Point as PixiPoint } from 'pixi.js';

import Point from 'src/models/Point';
import point from 'src/types/point';

function getCameraPos() {
	// TODO: store the camera pos in the store
	return {
		x: 0,
		y: 0,
	};
}

const Editor = types.model({
	position: types.optional(Point, {
		x: 0,
		y: 0,
	}),
	scale: 1,
}).actions((self) => ({
	setScale(scale: number) {
		self.scale = scale;
	},
})).views((self) => ({
	screenToWorld(screenPos: point) {
		const cameraPos = getCameraPos();

		return {
			x: self.position.x + (screenPos.x - cameraPos.x) * (1/self.scale),
			y: self.position.y + (screenPos.y - cameraPos.y) * (1/self.scale),
		};
	},
	get scaleAsPixiPoint() {
		return new PixiPoint(self.scale, self.scale);
	}
}));
export default Editor;
export interface IEditor extends Instance<typeof Editor> {}
