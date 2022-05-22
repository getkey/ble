import { types, SnapshotIn, SnapshotOut, destroy, Instance, getRoot } from 'mobx-state-tree';

import Entity, { IEntity } from 'src/models/Entity';
import { levelPreProcessor, levelPostProcessor } from 'src/utils/snapshot';
import { IRootStore } from 'src/models/RootStore';

const BaseLevel = types.model({
	name: 'My level',
	timings: types.refinement(
		types.array(types.integer),
		(value) => value !== undefined && value.length === 2,
	),
	entities: types.array(Entity),
}).actions((self) => ({
	addEntities(entities: Array<IEntity>): void {
		self.entities.push(...entities);
	},
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
		const entities = self.entities.filter((inListEntity) => inListEntity !== entity);
		entities.splice(position, 0, entity);
		self.entities.replace(entities);
	},
	cleanInvalidEntities(): void {
		self.entities.forEach((entity) => {
			if ('cleanInvalid' in entity.params) {
				entity.params.cleanInvalid();
			}
		});
	},
	clearEntities(): void {
		self.entities.forEach((entity) => entity.remove());
	},
})).actions((self) => ({
	clear(): void {
		const root: IRootStore = getRoot(self);
		root.undoManager.startGroup();
		self.clearEntities();
		self.setName('My level');
		self.set2StarsTime(0);
		self.set3StarsTime(0);
		root.undoManager.stopGroup();
	},
}));

const Level = types.snapshotProcessor(BaseLevel, {
	preProcessor: levelPreProcessor,
	postProcessor: levelPostProcessor,
});

export default Level;
// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface ILevel extends Instance<typeof Level> {}
// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface SnapshotInBaseLevel extends SnapshotIn<typeof BaseLevel> {}
// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface SnapshotOutBaseLevel extends SnapshotOut<typeof BaseLevel> {}
