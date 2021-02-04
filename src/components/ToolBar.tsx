import React, { FunctionComponent } from 'react';
import styled from '@emotion/styled';
import { observer } from 'mobx-react-lite';

import { useStore } from 'src/hooks/useStore';
import ModeBar from 'src/components/ModeBar';
import NumberInput from 'src/components/NumberInput';
import ClearButton from 'src/components/ClearButton';

const GridSizeInput = styled(NumberInput)`
	width: 6ex;
`;

const Container = styled.div`
	background-color: white;
	border-radius: 3px;
	display: flex;
	align-items: center;
	position: absolute;
	top: calc(100% + 0.75em);
	left: 0.5em;
`;

const ToolBar: FunctionComponent = () => {
	const { editor } = useStore();

	function onCellSizeChange(value: number): void {
		editor.setGridCellSize(value);
	}

	return (
		<Container>
			<ModeBar/>
			<label>Grid size: <GridSizeInput min={0} value={editor.gridCellSize} onChange={onCellSizeChange}/></label>
			<ClearButton/>
		</Container>
	);
};

export default observer(ToolBar);
