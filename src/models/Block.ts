import { types, Instance, getParent, SnapshotOut } from 'mobx-state-tree';
import { nanoid } from 'nanoid';

import VerticesParams from 'src/models/VerticesParams';
import { ILevel } from 'src/models/Level';
import { BlockType } from 'src/types/entity';
import { blockAliases } from 'src/aliases';

const Block = types.model({
	id: types.optional(types.identifier, nanoid),
	type: types.enumeration(Object.values(BlockType)),
	params: types.compose(
		types.model({
			isStatic: false,
		}),
		VerticesParams,
	),
}).views((self) => ({
	get displayName(): string {
		return `${blockAliases[self.type]} polygon`;
	},
})).actions((self) => ({
	setIsStatic(isStatic: boolean): void {
		self.params.isStatic = isStatic;
	},
	remove(): void {
		const parent = (getParent(self, 2) as ILevel);
		parent.removeEntity(self as IBlock);
	},
// see https://mobx-state-tree.js.org/tips/typescript#typing-self-in-actions-and-views
// for why this is a separate action block
}));
export default Block;
// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface IBlock extends Instance<typeof Block> {}
// eslint-disable-next-line @typescript-eslint/no-empty-interface
export type SnapshotOutBlock = SnapshotOut<typeof Block>;
