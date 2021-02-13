import { types } from 'mobx-state-tree';

const StaticParams = types.model({
	isStatic: true,
}).actions((self) => ({
	setIsStatic(isStatic: boolean): void {
		self.isStatic = isStatic;
	},
}));

export default StaticParams;
