import { types, Instance } from 'mobx-state-tree';
import { Point } from 'pixi.js';
import nanoid from 'nanoid';

const PointM = types.model({
	id: types.optional(types.identifier, nanoid),
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
	get displayName(): string {
		return `Point (${self.x}, ${self.y})`;
	},
}));
export default PointM;
// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface IPoint extends Instance<typeof PointM> {}
