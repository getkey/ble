import React, { FunctionComponent, Fragment } from 'react';
import styled from '@emotion/styled';
import { observer } from 'mobx-react-lite';

import { useStore } from 'src/hooks/useStore';
import ModeBar from 'src/components/ModeBar';
import ParamsBox from 'src/components/ParamsBox';
import ZoomButtons from 'src/components/ZoomButtons';
import NumberInput from 'src/components/NumberInput';

const TopLeftDiv = styled.div`
	position: absolute;
	top: 0;
	left: 0;
	background-color: white;
	display: flex;
`;

const GridSizeInput = styled(NumberInput)`
	width: 6ex;
`;

const GridSizeLabel = styled.label`
	display: inline-flex;
	flex-direction: column;
`;

const DomApp: FunctionComponent = () => {
	const { editor } = useStore();

	function onCellSizeChange(value: number): void {
		editor.setGridCellSize(value);
	}

	return (
		<Fragment>
			<TopLeftDiv>
				<ModeBar/>
				<GridSizeLabel><span>Grid</span><span>size:</span><GridSizeInput min="0" value={editor.gridCellSize} onChange={onCellSizeChange}/></GridSizeLabel>
			</TopLeftDiv>
			<ParamsBox/>
			<ZoomButtons/>
		</Fragment>
	);
};

export default observer(DomApp);
