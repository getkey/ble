import { types, getRoot } from 'mobx-state-tree';

import { EditorMode } from 'src/types/editor';
import { AddType } from 'src/types/entity';
import { IRootStore } from 'src/models/RootStore';

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
		const root: IRootStore = getRoot(self);
		root.undoManager.withoutUndo(() => {
			self.fontLoaded = true;
		});
	},
}));

export default EditorMisc;
