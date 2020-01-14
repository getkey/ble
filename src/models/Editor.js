import { types } from 'mobx-state-tree';

import Point from 'src/models/Point.js';

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
}));
