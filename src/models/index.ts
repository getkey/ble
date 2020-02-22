import { types, Instance } from 'mobx-state-tree';

import Editor from 'src/models/Editor';
import LevelProcessor from 'src/models/LevelProcessor';
import { EntityType, BlockType } from 'src/types/entity';
import { EditorMode } from 'src/types/editor';
import Block from 'src/models/Block';
import Door from 'src/models/Door';
import Hoppi from 'src/models/Hoppi';
import IPoint from 'src/types/point';
import sampleLevel from 'src/sampleLevel.json';

const RootStore = types.model({
	editor: types.optional(Editor, {
		position: {
			x: 0,
			y: 0,
		},
		mode: EditorMode.select,
		addType: EntityType.normal,
	}),
	level: types.optional(LevelProcessor, sampleLevel),
}).actions((self) => ({
	addEntity(pos: IPoint): void {
		const id = self.level.entityIdCounter.toString(10);
		let entity = null;

		if (self.editor.addType in BlockType) {
			entity = Block.create({
				id,
				type: self.editor.addType as unknown as BlockType,
				params: {
					vertices: [
						pos,
					],
					isStatic: true,
				},
			});
		}

		if (self.editor.addType === EntityType.endpoint) {
			entity = Door.create({
				id,
				type: EntityType.endpoint,
				params: {
					x: pos.x,
					y: pos.y,
				},
			});
		}

		if (self.editor.addType === EntityType.player) {
			entity = Hoppi.create({
				id,
				type: EntityType.player,
				params: {
					x: pos.x,
					y: pos.y,
					magazine: [],
				},
			});
		}

		if (entity !== null) {
			self.level.entities.set(id, entity);
			self.editor.selectedEntity = entity;
			self.level.entityIdCounter += 1;
		} else {
			throw new Error('Invalid entity type');
		}
	},
}));
export const store = RootStore.create();
// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface IRootStore extends Instance<typeof RootStore> {}
