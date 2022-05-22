import { types } from 'mobx-state-tree';

import { EditorMode } from 'src/types/editor';
import { AddType } from 'src/types/entity';

const EditorMisc = types.model({
	mode: types.optional(
		types.enumeration(Object.values(EditorMode)),
		EditorMode.select,
	),
	addType: types.optional(
		types.enumeration(Object.values(AddType)),
		AddType.normalBlock,
	),
	fontLoaded: false,
}).actions((self) => ({
	setMode(mode: EditorMode): void {
		self.mode = mode;
	},
	setAddType(addType: AddType): void {
		self.addType = addType;
	},
	setFontLoaded(): void {
		self.fontLoaded = true;
	},
}));

export default EditorMisc;
