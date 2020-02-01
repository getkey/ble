import { types, Instance } from 'mobx-state-tree';

import Editor from 'src/models/Editor';
import Level from 'src/models/Level';
import { EntityType } from 'src/types/entity';
import { EditorMode } from 'src/types/editor';
import IPoint from 'src/types/point';

const RootStore = types.model({
	editor: types.optional(Editor, {
		position: {
			x: 0,
			y: 0,
		},
		mode: EditorMode.select,
		addType: EntityType.normal,
	}),
	level: types.optional(Level, {
		timings: [0, 0],
		entities: {
			'0': {
				id: '0',
				type: EntityType['normal'],
				params: {
					vertices: [
						{ x: 60, y: 60 },
						{ x: 60, y: 120 },
						{ x: 120, y: 120 },
						{ x: 120, y: 60 },
					],
					isStatic: false,
				},
			},
			'1': {
				id: '1',
				type: EntityType['ice'],
				params: {
					vertices: [
						{ x: 120, y: 300 },
						{ x: 120, y: 360 },
						{ x: 240, y: 360 },
						{ x: 240, y: 300 },
						{ x: 180, y: 240 },
					],
					isStatic: true,
				},
			},
		},
		entityIdCounter: 2,
	}),
}).actions((self) => ({
	addEntity(pos: IPoint): void {
		const id = self.level.entityIdCounter.toString(10);
		const entity = {
			id,
			type: self.editor.addType,
			params: {
				vertices: [
					pos,
				],
				isStatic: true,
			},
		};
		self.level.entities.set(id, entity);
		self.level.entityIdCounter += 1;
		const ent = self.level.entities.get(id);
		self.editor.selectedEntity = ent;
	},
}));
export const store = RootStore.create();
// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface IRootStore extends Instance<typeof RootStore> {}
