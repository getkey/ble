import { onSnapshot } from 'mobx-state-tree';
import { validateLevel } from 'bombhopperio-level-tools';
import { saveAs } from 'file-saver';

import RootStore from 'src/models/RootStore';
import sampleLevel from 'src/sampleLevel.json';
import { setStorage, getStorage } from 'src/utils/storage';
import { levelStorageKey, gridCellSizeStorageKey } from 'src/config';

let initialLevel = sampleLevel;
try {
	const storageLevel = getStorage(levelStorageKey);

	if (storageLevel !== null) {
		try {
			validateLevel(storageLevel);
			initialLevel = storageLevel;
		} catch (err) {
			if (window.confirm('Your level appears to be corrupted.\nThe default level will erase it.\nDo you want to download it before it\'s overwritten?')) {
				const blob = new Blob([JSON.stringify(storageLevel)], { type: 'application/json; charset=utf-8' });
				saveAs(blob, 'invalid-level.json');
			}
		}
	}
} catch (err) {
	alert(`Invalid level ${err}`);
}

export const store = RootStore.create({
	level: initialLevel,
	editor: {
		gridCellSize: getStorage(gridCellSizeStorageKey) as number | null ?? undefined,
	},
});
// @ts-expect-error
window.store = store;

onSnapshot(store.level, (patch) => {
	setStorage(levelStorageKey, patch);
});

onSnapshot(store.editor, (patch) => {
	setStorage(gridCellSizeStorageKey, patch.gridCellSize);
});
