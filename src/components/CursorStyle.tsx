import React, { FunctionComponent } from 'react';
import { observer } from 'mobx-react-lite';

import { useStore } from 'src/hooks/useStore';
import { EditorMode } from 'src/types/editor';
import addBlock from 'src/icons/add_block.svg';
import addVertex from 'src/icons/add_vertex.svg';

const ModeBar: FunctionComponent<{}> = () => {
	const { editor } = useStore();

	let cursor = 'default';

	switch(editor.mode) {
		case EditorMode.addBlock:
			cursor = `url(${addBlock}), default`;
			break;
		case EditorMode.addVertex:
			cursor = `url(${addVertex}), default`;
			break;
	}

	if (editor.panning) {
		cursor = 'all-scroll';
	}

	return (
		<style>{`body {
			cursor: ${cursor};
		}`}</style>
	);
};

export default observer(ModeBar);
