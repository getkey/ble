import { types, Instance } from 'mobx-state-tree';

const StaticParams = types.model({
	isStatic: true,
}).actions((self) => ({
	setIsStatic(isStatic: boolean): void {
		self.isStatic = isStatic;
	},
}));

export default StaticParams;
// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface IStaticParams extends Instance<typeof StaticParams> {}
