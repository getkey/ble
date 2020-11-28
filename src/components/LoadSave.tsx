import React, { FunctionComponent, ChangeEvent, Fragment } from 'react';
import { getSnapshot, applySnapshot } from 'mobx-state-tree';
import { observer } from 'mobx-react-lite';
import styled from '@emotion/styled';
import { saveAs } from 'file-saver';
import { validate } from 'bombhopperio-level-tools';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSave, faFolderOpen, faPlay, faUpload } from '@fortawesome/free-solid-svg-icons';

import { useStore } from 'src/hooks/useStore';
import { toFilename } from 'src/utils/io';
import { levelPreProcessor } from 'src/utils/snapshot';
import { buttonCss } from 'src/utils/buttons';
import { inIframe, postMessage } from 'src/utils/iframe';

const Container = styled.div`
	display: flex;
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
		// don't want invalid entities to end up in the snapshot
		level.cleanInvalidEntities();

		const snapshot = getSnapshot(level);

		try {
			validate(snapshot);
		} catch (err) {
			// eslint-disable-next-line no-console
			console.error(err);
			alert(`Error: your level contains invalid elements. Come to https://discord.gg/KEb4wSN for help!

${err.message || JSON.stringify(err)}`);
		}

		const filename = toFilename(level.name, 'json');
		const snapshotStr = JSON.stringify(snapshot, null, '\t') + '\n';

		const blob = new Blob([snapshotStr], { type: 'application/json; charset=utf-8' });
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

	function sendLevelToGame(messageType: 'loadLevel' | 'uploadLevel'): void {
		// don't want invalid entities to end up in the snapshot
		level.cleanInvalidEntities();

		const snapshot = getSnapshot(level);

		try {
			validate(snapshot);
		} catch (err) {
			// eslint-disable-next-line no-console
			console.error(err);
			alert(`Error: your level contains invalid elements. Come to https://discord.gg/KEb4wSN for help!

${err.message || JSON.stringify(err)}`);
			return;
		}

		postMessage({
			type: messageType,
			level: snapshot,
		});
	}

	function onTest(): void {
		sendLevelToGame('loadLevel');
	}

	function onUpload(): void {
		if(!window.confirm('Are you sure you want to upload this level?')) {
			return;
		}

		sendLevelToGame('uploadLevel');
	}

	return (
		<Container>
			<FilePicker>
				<FontAwesomeIcon icon={faFolderOpen}/>
				&#32;
				Load level<input accept="application/json" type="file" onChange={onLoad}/></FilePicker>
			<Button onClick={onSave}>
				<FontAwesomeIcon icon={faSave}/>
				&#32;
				Save level
			</Button>
			{inIframe && (
				<Fragment>
					<Button onClick={onTest}>
						<FontAwesomeIcon icon={faPlay}/>
						&#32;
						Test level
					</Button>
					<Button onClick={onUpload}>
						<FontAwesomeIcon icon={faUpload}/>
						&#32;
						Upload level
					</Button>
				</Fragment>
			)}
		</Container>
	);
};

export default observer(DomApp);
