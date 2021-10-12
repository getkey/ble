import { types, Instance } from 'mobx-state-tree';

const TextureMirroringParams = types.model({
	rightFacing: false,
}).actions((self) => ({
	setRightFacing(rightFacing: boolean): void {
		self.rightFacing = rightFacing;
	},
}));

export default TextureMirroringParams;
// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface ITextureMirroringParams extends Instance<typeof TextureMirroringParams> {}
