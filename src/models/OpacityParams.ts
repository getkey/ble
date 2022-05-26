import { types, Instance } from 'mobx-state-tree';

const OpacityParams = types.model({
	opacity: types.optional(
		types.refinement(
			types.number,
			(value) => value >= 0 && value <= 1,
		),
		1,
	),
}).actions((self) => ({
	setOpacity(opacity: number) {
		self.opacity = opacity;
	},
}));

export default OpacityParams;
// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface IOpacityParams extends Instance<typeof OpacityParams> {}
