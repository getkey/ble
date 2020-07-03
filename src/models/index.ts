import { types, Instance } from 'mobx-state-tree';

import Editor from 'src/models/Editor';
import LevelProcessor from 'src/models/LevelProcessor';
import { AddType, AmmoType, blockAddTypes, ballAddTypes } from 'src/types/entity';
import { addTypeToBlock } from 'src/aliases';
import Block from 'src/models/Block';
import Ball from 'src/models/Ball';
import Door from 'src/models/Door';
import Hoppi from 'src/models/Hoppi';
import Text from 'src/models/Text';
import IPoint from 'src/types/point';
import sampleLevel from 'src/sampleLevel.json';
import { IEntity } from 'src/models/Entity';

const RootStore = types.model({
	editor: types.optional(Editor, {
		position: {
			x: 400,
			y: 600,
		},
	}),
	level: types.optional(LevelProcessor, sampleLevel),
}).actions((self) => ({
	addEntity(entity: IEntity): void {
		self.level.entities.push(entity);
		self.editor.setSelectedEntity(entity);
	},
})).actions((self) => ({
	createEntity(pos: IPoint): void {
		if (self.editor.addType === AddType.endpoint) {
			self.addEntity(
				Door.create({
					type: AddType.endpoint,
					params: {
						x: pos.x,
						y: pos.y,
					},
				})
			);
		} else if (self.editor.addType === AddType.player) {
			self.addEntity(
				Hoppi.create({
					type: AddType.player,
					params: {
						x: pos.x,
						y: pos.y,
						magazine: [
							AmmoType.bullet,
							AmmoType.bullet,
						],
					},
				})
			);
		} else if (self.editor.addType === AddType.text) {
			self.addEntity(
				Text.create({
					type: AddType.text,
					params: {
						x: pos.x,
						y: pos.y,
					},
				})
			);
		} else if (blockAddTypes.includes(self.editor.addType)) {
			self.addEntity(
				Block.create({
					type: addTypeToBlock[self.editor.addType],
					params: {
						vertices: [
							pos,
						],
						isStatic: true,
					},
				})
			);
		} else if (ballAddTypes.includes(self.editor.addType)) {
			self.addEntity(
				Ball.create({
					type: addTypeToBlock[self.editor.addType],
					params: {
						x: pos.x,
						y: pos.y,
						isStatic: true,
					},
				})
			);
		} else {
			throw new Error('Invalid entity type');
		}
	},
}));
export const store = RootStore.create();
// @ts-ignore
window.store = store;
// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface IRootStore extends Instance<typeof RootStore> {}
