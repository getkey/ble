import { types } from 'mobx-state-tree';

import Point from 'src/models/Point.js';

function getCameraPos() {
	// TODO: store the camera pos in the store
	return {
		x: 0,
		y: 0,
	};
}

export default types.model({
	position: types.optional(Point, {
		x: 0,
		y: 0,
	}),
	scale: 1,
}).actions((self) => ({
	setScale(scale) {
		self.scale = scale;
	},
})).views((self) => ({
	screenToWorld(screenPos) {
		const cameraPos = getCameraPos();

		return {
			x: self.position.x + (screenPos.x - cameraPos.x) * (1/self.scale),
			y: self.position.y + (screenPos.y - cameraPos.y) * (1/self.scale),
		};
	},
}));
