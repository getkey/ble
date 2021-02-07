import { types } from 'mobx-state-tree';
import { UndoManager } from 'mst-middlewares';

// eslint-disable-next-line @typescript-eslint/no-empty-function
const noOp = () => {};

// blur events happen after pointerdown events, which makes it sometimes impossible to close the group
// at the right time. This model will automatically close groups if needed, and make sure not to close already closed groups
const SoftUndoManager = types.model({
	undoManager: types.optional(UndoManager, {}),
	inGroup: false,
}).actions((self) => ({
	withoutUndo<T>(fn: () => T): T {
		return self.undoManager.withoutUndo(fn);
	},
})).actions((self) => ({
	stopGroup() {
		if (self.inGroup) { // sometimes startGroup will already have stopped a running group, in which case we do nothing
			self.undoManager.stopGroup();
			self.withoutUndo(() => {
				self.inGroup = false;
			});
		}
	},
})).actions((self) => ({
	startGroup() {
		self.stopGroup();

		self.undoManager.startGroup(noOp);
		self.undoManager.withoutUndo(() => {
			self.inGroup = true;
		});
	},
	undo(): void {
		self.undoManager.undo();
	},
	redo(): void {
		self.undoManager.redo();
	},
})).views((self) => ({
	get canUndo() {
		return self.undoManager.canUndo;
	},
	get canRedo() {
		return self.undoManager.canRedo;
	},
}));

export default SoftUndoManager;
