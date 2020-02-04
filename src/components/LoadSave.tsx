import React, { FunctionComponent, Fragment, ChangeEvent } from 'react';
import { getSnapshot, applySnapshot } from 'mobx-state-tree';
import { observer } from 'mobx-react-lite';

import { useStore } from 'src/hooks/useStore';
import { download } from 'src/utils/download';
import { levelPreProcessor } from 'src/utils/snapshot';

const DomApp: FunctionComponent<{}> = () => {
	const { level } = useStore();

	function onSave(): void {
		const snapshot = JSON.stringify(getSnapshot(level), null, '\t');
		download(snapshot, 'level.json', 'application/json');
	}

	function onLoad(ev: ChangeEvent<HTMLInputElement>): void {
		if (ev.target.files === null || ev.target.files.length < 1) return;

		const reader = new FileReader();
		reader.addEventListener('load', (ev_) => {
			if (ev_.target === null) return;

			try {
				const snapshot = JSON.parse(ev_.target.result as string);
				const actualSnapshot = levelPreProcessor(snapshot);
				// we have to patch the snapshot here because of this bug https://github.com/mobxjs/mobx-state-tree/issues/1317
				// eslint-disable-next-line @typescript-eslint/ban-ts-ignore
				// @ts-ignore
				applySnapshot(level, actualSnapshot);
			} catch (err) {
				// eslint-disable-next-line no-console
				console.error(err);
				alert('Invalid file');
			}
		});
		reader.readAsText(ev.target.files[0]);
	}

	return (
		<Fragment>
			<button onClick={onSave}>Save</button>
			<label>Load: <input type="file" onChange={onLoad}/></label>
		</Fragment>
	);
};

export default observer(DomApp);
