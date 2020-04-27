import { types, Instance, getParent } from 'mobx-state-tree';
import { nanoid } from 'nanoid';

import { ILevel } from 'src/models/Level';

const Text = types.model({
	id: types.optional(types.identifier, nanoid),
	type: types.literal('text'),
	params: types.model({
		x: types.number,
		y: types.number,
		isSelected: true,
		copy: types.optional(types.model({
			en: types.string,
		}), {
			en: 'Some text\nand a new line',
		}),
		anchor: types.optional(types.model({
			x: types.number,
			y: types.number,
		}), {
			x: 0.5,
			y: 0.5,
		}),
	}),
}).actions((self) => ({
	move(deltaX: number, deltaY: number): void {
		self.params.x += deltaX;
		self.params.y += deltaY;
	},
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
