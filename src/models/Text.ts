import { types, Instance, getParent, ISimpleType, IMaybe } from 'mobx-state-tree';
import { nanoid } from 'nanoid';

import { ILevel } from 'src/models/Level';

const lel = ['en', 'fr'].reduce((acc, code) => {
	acc[code] = types.maybe(types.string);
	return acc;
}, {} as { [index: string]: IMaybe<ISimpleType<string>> });

const Text = types.model({
	id: types.optional(types.identifier, nanoid),
	type: types.literal('text'),
	params: types.model({
		x: types.number,
		y: types.number,
		isSelected: true,
		copy: types.optional(types.model(lel), {
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
	setCopy(lang: string, copy: string): void {
		self.params.copy[lang] = copy;
	},
})).views(() => ({
	get displayName(): string {
		return 'Text';
	},
}));
export default Text;
// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface IText extends Instance<typeof Text> {}
