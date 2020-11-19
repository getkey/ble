import { types, SnapshotIn, destroy, Instance, detach } from 'mobx-state-tree';

import Entity, { IEntity } from 'src/models/Entity';

const Level = types.model({
	name: 'My level',
	timings: types.refinement(
		types.array(types.integer),
		(value) => value !== undefined && value.length === 2,
	),
	entities: types.array(Entity),
}).actions((self) => ({
	set2StarsTime(ms: number): void {
		self.timings[0] = ms;

		// 2 stars must always be bigger or equal to 3 stars
		if (ms < self.timings[1]) {
			self.timings[1] = ms;
		}
	},
	set3StarsTime(ms: number): void {
		self.timings[1] = ms;

		// 3 stars must always be smaller or equal to 2 stars
		if (ms > self.timings[0]) {
			self.timings[0] = ms;
		}
	},
	setName(name: string): void {
		self.name = name;
	},
	removeEntity(child: IEntity): void {
		destroy(child);
	},
})).views((self) => ({
	getEntityPosition(entity: IEntity): number {
		return self.entities.findIndex((someEntity) => someEntity === entity);
	},
})).actions((self) => ({
	move(entity: IEntity, position: number): void {
		detach(entity);
		self.entities.splice(position, 0, entity);
	},
	cleanInvalidEntities(): void {
		self.entities.forEach((entity) => {
			if ('cleanInvalid' in entity) {
				entity.cleanInvalid();
			}
		});
	},
	clearEntities(): void {
		self.entities.forEach((entity) => entity.remove());
	},
}));

export default Level;
// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface ILevel extends Instance<typeof Level> {}
// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface SnapshotInLevel extends SnapshotIn<typeof Level> {}
