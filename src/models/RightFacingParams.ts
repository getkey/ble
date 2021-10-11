import { types, Instance } from 'mobx-state-tree';

const RightFacingParams = types.model({
	rightFacing: true,
}).actions((self) => ({
	setRightFacing(rightFacing: boolean): void {
		self.rightFacing = rightFacing;
	},
}));

export default RightFacingParams;
// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface IRightFacingParams extends Instance<typeof RightFacingParams> {}