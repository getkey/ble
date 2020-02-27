import { types, Instance } from 'mobx-state-tree';
import nanoid from 'nanoid';

const Door = types.model({
	id: types.optional(types.identifier, nanoid),
	type: types.literal('endpoint'),
	params: types.model({
		x: types.number,
		y: types.number,
		isStatic: false,
		rightFacing: true,
		angle: 0,
	}),
}).actions((self) => ({
	move(deltaX: number, deltaY: number): void {
		self.params.x += deltaX;
		self.params.y += deltaY;
	},
	setIsStatic(isStatic: boolean): void {
		self.params.isStatic = isStatic;
	},
	setAngle(angle: number): void {
		self.params.angle = angle;
	},
})).views(() => ({
	get displayName(): string {
		return 'Door';
	},
}));
export default Door;
// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface IDoor extends Instance<typeof Door> {}
