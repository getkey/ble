import React, { FunctionComponent, Fragment } from 'react';
import { observer } from 'mobx-react-lite';
import styled from '@emotion/styled';
import { buttonCss } from 'src/utils/buttons';

import { useStore } from 'src/hooks/useStore';
import Vertex from 'src/models/Vertex';
import Hoppi from 'src/models/Hoppi';

const Number = styled.span`
	margin: 0 0.2em;
`;

const Button = styled.button`
	${buttonCss};
`;

const Tip = styled.p`
	margin-top: 0.1em;
`;

const ZOrderParam: FunctionComponent<{}> = () => {
	const { editor, level } = useStore();
	const { selectedEntity } = editor;

	if (selectedEntity === undefined || Vertex.is(selectedEntity)) return null;

	const position = level.getEntityPosition(selectedEntity);

	function moveUp(): void {
		if (selectedEntity === undefined || Vertex.is(selectedEntity)) return;

		level.move(selectedEntity, position + 1);
		editor.setSelectedEntity(selectedEntity);
	}
	function moveDown(): void {
		if (selectedEntity === undefined || Vertex.is(selectedEntity)) return;

		level.move(selectedEntity, position - 1);
		editor.setSelectedEntity(selectedEntity);
	}

	return (
		<Fragment>
			<div>
				<label>z-order:</label>
				<Button onClick={moveDown} disabled={position <= 0}>Move down</Button>
				<Number>{position + 1}</Number>
				<Button onClick={moveUp} disabled={position >= level.entities.length - 1}>Move up</Button>
			</div>
			{Hoppi.is(selectedEntity) && (
				<Tip>Tip: the lowest hoppi holds the camera</Tip>
			)}
		</Fragment>
	);
};

export default observer(ZOrderParam);
