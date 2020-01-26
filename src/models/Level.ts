import { types } from 'mobx-state-tree';

import Entity from 'src/models/Entity';

export default types.model({
	timings: types.refinement(
		types.array(types.integer),
		(value) => value !== undefined && value.length === 2
	),
	entities: types.array(Entity),
}).actions((self) => ({
	set2StarsTime(ms: number): void {
		self.timings[0] = ms;
	},
	set3StarsTime(ms: number): void {
		self.timings[1] = ms;
	},
	deleteEntity(index: number): void {
		self.entities.splice(index, 1);
	},
}));
