import { types } from 'mobx-state-tree';

const Point = types.model({
	x: 0,
	y: 0,
}).actions((self) => ({
	set(x, y) {
		self.x = x;
		self.y = y;
	},
}));

export const Editor = types.model({
	position: types.optional(Point, {
		x: 0,
		y: 0,
	}),
	scale: 1,
});

