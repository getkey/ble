import { types, SnapshotIn } from 'mobx-state-tree';

import Entity from 'src/models/Entity';

const Level = types.model({
	name: types.string,
	timings: types.refinement(
		types.array(types.integer),
		(value) => value !== undefined && value.length === 2,
	),
	entities: types.map(Entity),
	entityIdCounter: 0,
}).actions((self) => ({
	set2StarsTime(ms: number): void {
		self.timings[0] = ms;
	},
	set3StarsTime(ms: number): void {
		self.timings[1] = ms;
	},
	deleteEntity(id: string): void {
		self.entities.delete(id);
	},
	setName(name: string): void {
		self.name = name;
	},
}));

export default Level;
// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface SnapshotInLevel extends SnapshotIn<typeof Level> {}
