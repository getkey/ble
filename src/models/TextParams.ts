import { types, Instance, getParent, ISimpleType, IMaybe } from 'mobx-state-tree';
import languages from 'iso-639-1';

import { IEntity } from 'src/models/Entity';

const l18nObj = languages.getAllCodes().reduce((acc, code) => {
	acc[code] = code === 'en' ? types.string : types.maybe(types.string);
	return acc;
}, {} as { [index: string]: IMaybe<ISimpleType<string>> });

const TextParams = types.model({
	copy: types.optional(types.model(l18nObj), {
		en: 'Some text\nand a new line',
	}),
	anchor: types.optional(types.model({
		x: types.number,
		y: types.number,
	}), {
		x: 0.5,
		y: 0.5,
	}),
}).actions((self) => ({
	setCopy(lang: string, copy: string): void {
		self.copy[lang] = copy;
	},
	removeLang(lang: string): void {
		if (lang === 'en') throw new Error('Text must have at least an english translation');

		self.copy[lang] = undefined;
	},
	cleanInvalid(): void {
		const isValid = Object.values(self.copy).some((copy) => copy !== '' && copy !== undefined);

		if (!isValid) {
			(getParent(self) as TextParamsEntity).remove();
		}
	},
}));

export default TextParams;
// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface ITextParams extends Instance<typeof TextParams> {}
// convenience type
export type TextParamsEntity = IEntity & {
	params: ITextParams,
};
