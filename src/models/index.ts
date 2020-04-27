import { types, Instance } from 'mobx-state-tree';

import Editor from 'src/models/Editor';
import LevelProcessor from 'src/models/LevelProcessor';
import { EntityType, BlockType, AmmoType } from 'src/types/entity';
import Block from 'src/models/Block';
import Door from 'src/models/Door';
import Hoppi from 'src/models/Hoppi';
import Text from 'src/models/Text';
import IPoint from 'src/types/point';
import sampleLevel from 'src/sampleLevel.json';

const RootStore = types.model({
	editor: types.optional(Editor, {
		position: {
			x: 400,
			y: 600,
		},
	}),
	level: types.optional(LevelProcessor, sampleLevel),
}).actions((self) => ({
	addEntity(pos: IPoint): void {
		let entity = null;

		if (self.editor.addType in BlockType) {
			entity = Block.create({
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
				type: EntityType.endpoint,
				params: {
					x: pos.x,
					y: pos.y,
				},
			});
		}

		if (self.editor.addType === EntityType.player) {
			entity = Hoppi.create({
				type: EntityType.player,
				params: {
					x: pos.x,
					y: pos.y,
					magazine: [
						AmmoType.bullet,
						AmmoType.bullet,
					],
				},
			});
		}

		if (self.editor.addType === EntityType.text) {
			entity = Text.create({
				type: EntityType.text,
				params: {
					x: pos.x,
					y: pos.y,
				},
			});
		}

		if (entity !== null) {
			self.level.entities.put(entity);
			self.editor.selectedEntity = entity;
		} else {
			throw new Error('Invalid entity type');
		}
	},
}));
export const store = RootStore.create();
// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface IRootStore extends Instance<typeof RootStore> {}
