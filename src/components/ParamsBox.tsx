import React, { FunctionComponent } from 'react';
import { observer } from 'mobx-react-lite';
import styled from '@emotion/styled';

import { useStore } from 'src/hooks/useStore';
import Box from 'src/components/Box';
import TextParam from 'src/components/TextParam';
import { buttonCss } from 'src/utils/buttons';
import AngleParam from 'src/components/AngleParam';
import StaticParam from 'src/components/StaticParam';
import HoppiParam from 'src/components/HoppiParam';
import ZOrderParam from 'src/components/ZOrderParam';

const DeleteButton = styled.button`
	${buttonCss}
	background-color: red;
	border-color: red;
	box-shadow: none;
	color: white;

	&:active {
		background: white;
		color: red;
	}
`;

const ParamsBox: FunctionComponent = () => {
	const { editor: { selectedEntity } } = useStore();

	if (selectedEntity === undefined) return null;

	function onDelete(): void {
		if (selectedEntity === undefined) return;

		selectedEntity.remove();
	}

	return (
		<Box title={selectedEntity.displayName}>
			<HoppiParam/>
			<StaticParam/>
			<AngleParam/>
			<TextParam/>
			<ZOrderParam/>
			<DeleteButton onClick={onDelete}>Delete entity</DeleteButton>
		</Box>
	);
};

export default observer(ParamsBox);
