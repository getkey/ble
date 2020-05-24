import React, { FunctionComponent, ChangeEvent } from 'react';
import { getSnapshot, applySnapshot } from 'mobx-state-tree';
import { observer } from 'mobx-react-lite';
import styled from '@emotion/styled';
import { saveAs } from 'file-saver';

import { useStore } from 'src/hooks/useStore';
import { toFilename } from 'src/utils/io';
import { levelPreProcessor } from 'src/utils/snapshot';
import { buttonCss } from 'src/utils/buttons';

const Container = styled.div`
	display: flex;
	justify-content: space-between;
	margin: 4px 0;
	font-size: 1rem;

	& > * {
		margin: 0 16px;
	}
	& > *:first-child {
		margin-left: 0;
	}
	& > *:last-child {
		margin-right: 0;
	}
`;

const FilePicker = styled.label`
	${buttonCss};

	& > input[type=file] {
		display: none;
	}
`;

const Button = styled.button`
	${buttonCss};
`;

const DomApp: FunctionComponent = () => {
	const { level } = useStore();

	function onSave(): void {
		const snapshot = JSON.stringify(getSnapshot(level), null, '\t');
		const filename = toFilename(level.name, 'json');

		const blob = new Blob([snapshot], { type: 'application/json; charset=utf-8' });
		saveAs(blob, filename);
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
		<Container>
			<FilePicker>Load level<input accept="application/json" type="file" onChange={onLoad}/></FilePicker>
			<Button onClick={onSave}>Save level</Button>
		</Container>
	);
};

export default observer(DomApp);
