import { types } from 'mobx-state-tree';
import { Point } from 'pixi.js';

export default types.model({
	x: types.number,
	y: types.number,
}).actions((self) => ({
	set(x: number, y: number): void {
		self.x = x;
		self.y = y;
	},
})).views((self) => ({
	get asPixiPoint(): Point {
		return new Point(self.x, self.y);
	},
}));
