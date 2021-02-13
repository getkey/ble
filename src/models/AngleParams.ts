import { types, Instance } from 'mobx-state-tree';

const AngleParams = types.model({
	angle: 0,
}).actions((self) => ({
	setAngle(angle: number): void {
		self.angle = angle;
	},
}));

export default AngleParams;
// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface IAngleParams extends Instance<typeof AngleParams> {}
