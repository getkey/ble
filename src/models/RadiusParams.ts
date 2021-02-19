import { types, Instance, getParent } from 'mobx-state-tree';

import { IEntity } from 'src/models/Entity';

const RadiusParams  = types.model({
	radius: types.optional(
		types.refinement(
			types.number,
			(value) => value >= 0,
		),
		15,
	),
}).actions((self) => {
	let hasBeenWarned = false;

	return {
		setRadius(radius: number): void {
			if (radius <= 0) {
				(getParent(self) as RadiusParamsEntity).remove();
				return;
			}

			if (!hasBeenWarned && radius > 5000) {
				if (window.confirm('Creating such a big circle can crash the editor. Take the risk?')) {
					hasBeenWarned = true;
				} else {
					return;
				}
			}

			self.radius = radius;
		},
	};
});

export default RadiusParams;
// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface IRadiusParams extends Instance<typeof RadiusParams> {}
// convenience type
export type RadiusParamsEntity = IEntity & {
	params: IRadiusParams,
};
