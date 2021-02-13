import { types, Instance, getParent } from 'mobx-state-tree';
import { nanoid } from 'nanoid';

import VerticesParams from 'src/models/VerticesParams';
import ColorParams from 'src/models/ColorParams';
import { ILevel } from 'src/models/Level';


const Paint = types.model({
	id: types.optional(types.identifier, nanoid),
	type: types.literal('paint'),
	params: types.compose(
		ColorParams,
		VerticesParams,
	),
}).views(() => ({
	get displayName(): string {
		return 'Paint';
	},
})).actions((self) => ({
	remove(): void {
		const parent = (getParent(self, 2) as ILevel);
		parent.removeEntity(self as IPaint);
	},
// see https://mobx-state-tree.js.org/tips/typescript#typing-self-in-actions-and-views
// for why this is a separate action block
}));
export default Paint;
// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface IPaint extends Instance<typeof Paint> {}
