import { types, Instance } from 'mobx-state-tree';

const PositionParams = types.model({
	x: types.number,
	y: types.number,
}).actions((self) => ({
	move(deltaX: number, deltaY: number): void {
		self.x += deltaX;
		self.y += deltaY;
	},
}));

export default PositionParams;
// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface IPositionParams extends Instance<typeof PositionParams> {}
