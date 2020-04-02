import { types, SnapshotIn, destroy, Instance } from 'mobx-state-tree';

import Entity, { IEntity } from 'src/models/Entity';

const Level = types.model({
	name: 'My level',
	timings: types.refinement(
		types.array(types.integer),
		(value) => value !== undefined && value.length === 2,
	),
	entities: types.map(Entity),
}).actions((self) => ({
	set2StarsTime(ms: number): void {
		self.timings[0] = ms;
	},
	set3StarsTime(ms: number): void {
		self.timings[1] = ms;
	},
	setName(name: string): void {
		self.name = name;
	},
	removeEntity(child: IEntity): void {
		destroy(child);
	},
}));

export default Level;
// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface ILevel extends Instance<typeof Level> {}
// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface SnapshotInLevel extends SnapshotIn<typeof Level> {}
