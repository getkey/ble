import React, { FunctionComponent, ChangeEvent } from 'react';
import { getSnapshot, applySnapshot } from 'mobx-state-tree';
import { observer } from 'mobx-react-lite';
import styled from '@emotion/styled';
import { css } from '@emotion/core';

import { useStore } from 'src/hooks/useStore';
import { download, toFilename } from 'src/utils/io';
import { levelPreProcessor } from 'src/utils/snapshot';

const sharedButton = css`
	border: 2px solid #448aff;
	cursor: pointer;
	border-radius: 4px;
	padding: 6px 8px;
	background-color: #448aff;
	transition: background-color 0.2s;
	color: white;
	font-family: sans;
	font-size: 1em;
	box-shadow: 0 0 1px 0px grey;

	&:hover {
		background-color: white;
		color: black;
	}

	&:active {
		background-color: #448aff;
		transition: none;
	}
`;

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
	${sharedButton};

	& > input[type=file] {
		display: none;
	}
`;

const Button = styled.button`
	${sharedButton};
`;

const DomApp: FunctionComponent<{}> = () => {
	const { level } = useStore();

	function onSave(): void {
		const snapshot = JSON.stringify(getSnapshot(level), null, '\t');
		const filename = toFilename(level.name, 'json');
		download(snapshot, filename, 'application/json');
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
		<Container>
			<FilePicker>Load level<input type="file" onChange={onLoad}/></FilePicker>
			<Button onClick={onSave}>Save level</Button>
		</Container>
	);
};

export default observer(DomApp);
