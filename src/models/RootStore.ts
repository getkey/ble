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
import Paint from 'src/models/Paint';
import SoftUndoManager from 'src/models/SoftUndoManager';
import IPoint from 'src/types/point';
import { IEntity } from 'src/models/Entity';

const RootStore = types.model({
	editor: Editor,
	level: LevelProcessor,
	undoManager: types.optional(SoftUndoManager, {}),
}).actions((self) => ({
	addEntities(entities: Array<IEntity>): void {
		self.level.entities.push(...entities);
		self.editor.setSelection(entities);
	},
})).actions((self) => ({
	createEntity(pos: IPoint): IEntity {
		let entity;
		if (self.editor.addType === AddType.endpoint) {
			entity = Door.create({
				type: AddType.endpoint,
				params: {
					x: pos.x,
					y: pos.y,
				},
			});
		} else if (self.editor.addType === AddType.player) {
			entity = Hoppi.create({
				type: AddType.player,
				params: {
					x: pos.x,
					y: pos.y,
					magazine: [
						AmmoType.bullet,
						AmmoType.bullet,
					],
				},
			});
		} else if (self.editor.addType === AddType.text) {
			entity = Text.create({
				type: AddType.text,
				params: {
					x: pos.x,
					y: pos.y,
				},
			});
		} else if (self.editor.addType === AddType.paint) {
			entity = Paint.create({
				type: AddType.paint,
				params: {
					vertices: [
						pos,
					],
				},
			});
		} else if (blockAddTypes.includes(self.editor.addType)) {
			entity = Block.create({
				type: addTypeToBlock[self.editor.addType],
				params: {
					vertices: [
						pos,
					],
					isStatic: true,
				},
			});
		} else if (ballAddTypes.includes(self.editor.addType)) {
			entity = Ball.create({
				type: addTypeToBlock[self.editor.addType],
				params: {
					x: pos.x,
					y: pos.y,
					isStatic: true,
				},
			});
		}

		if (entity === undefined) {
			throw new Error('Invalid entity type');
		}

		self.addEntities([entity]);

		return entity;
	},
}));
export default RootStore;
// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface IRootStore extends Instance<typeof RootStore> {}
