import { types, Instance } from 'mobx-state-tree';

const Door = types.model({
	id: types.identifier,
	type: types.literal('endpoint'),
	params: types.model({
		x: types.number,
		y: types.number,
		isStatic: false,
		rightFacing: true,
	}),
}).actions((self) => ({
	move(deltaX: number, deltaY: number): void {
		self.params.x += deltaX;
		self.params.y += deltaY;
	},
	setIsStatic(isStatic: boolean): void {
		self.params.isStatic = isStatic;
	},
}));
export default Door;
// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface IDoor extends Instance<typeof Door> {}
