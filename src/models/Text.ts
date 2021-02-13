import { types, Instance, getParent } from 'mobx-state-tree';
import { nanoid } from 'nanoid';

import { ILevel } from 'src/models/Level';
import AngleParams from 'src/models/AngleParams';
import PositionParams from 'src/models/PositionParams';
import TextParams from 'src/models/TextParams';

const Params = types.compose(
	AngleParams,
	PositionParams,
	TextParams,
);

const Text = types.model({
	id: types.optional(types.identifier, nanoid),
	type: types.literal('text'),
	params: Params,
}).actions((self) => ({
	remove(): void {
		const parent = (getParent(self, 2) as ILevel);
		parent.removeEntity(self as IText);
	},
})).views(() => ({
	get displayName(): string {
		return 'Text';
	},
}));
export default Text;
// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface IText extends Instance<typeof Text> {}
