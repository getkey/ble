import { UndoManager } from 'mst-middlewares';

// eslint-disable-next-line @typescript-eslint/no-empty-function
const noOp = () => {};

// blur events happen after pointerdown events, which makes it sometimes impossible to close the group
// at the right time. This model will automatically close groups if needed, and make sure not to close already closed groups
const SoftUndoManager = UndoManager.actions((self) => {
	let inGroup = false;
	const { stopGroup: oldStopGroup, startGroup: oldStartGroup } = self;

	function stopGroup() {
		// sometimes startGroup will already have stopped a running group, in which case we do nothing
		if (!inGroup) return;

		oldStopGroup();
		inGroup = false;
	}
	function startGroup() {
		stopGroup();

		oldStartGroup(noOp);
		inGroup = true;
	}

	return {
		stopGroup,
		startGroup,
	};
});

export default SoftUndoManager;
