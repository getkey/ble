import React, { FunctionComponent } from 'react';
import { observer } from 'mobx-react-lite';

import { useStore } from 'src/hooks/useStore';
import { EditorMode } from 'src/types/editor';
import bin from 'src/icons/bin.svg';

const ModeBar: FunctionComponent<{}> = () => {
	const { editor } = useStore();

	let cursor = 'default';

	switch(editor.mode) {
		case EditorMode.delete:
			cursor = `url(${bin}), default`;
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
