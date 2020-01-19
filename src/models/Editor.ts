import { types } from 'mobx-state-tree';
import { Point as PixiPoint } from 'pixi.js';

import Point from 'src/models/Point';
import IPoint from 'src/types/point';

function getCameraPos(): IPoint {
	// TODO: store the camera pos in the store
	return {
		x: 0,
		y: 0,
	};
}

const Editor = types.model({
	position: Point,
	scale: 1,
}).actions((self) => ({
	setScale(scale: number): void {
		self.scale = scale;
	},
})).views((self) => ({
	screenToWorld(screenPos: IPoint): IPoint {
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
