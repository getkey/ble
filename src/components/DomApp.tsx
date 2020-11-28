import React, { FunctionComponent, Fragment } from 'react';
import styled from '@emotion/styled';
import { observer } from 'mobx-react-lite';

import { useStore } from 'src/hooks/useStore';
import ModeBar from 'src/components/ModeBar';
import ParamsBox from 'src/components/ParamsBox';
import ZoomButtons from 'src/components/ZoomButtons';
import NumberInput from 'src/components/NumberInput';
import ClearButton from 'src/components/ClearButton';
import HomeButton from 'src/components/HomeButton';

const TopLeftDiv = styled.div`
	position: absolute;
	top: 0;
	left: 0;
	background-color: white;
	display: flex;
	align-items: center;
`;

const GridSizeInput = styled(NumberInput)`
	width: 6ex;
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
				<label>Grid size: <GridSizeInput min={0} value={editor.gridCellSize} onChange={onCellSizeChange}/></label>
				<ClearButton/>
				<HomeButton/>
			</TopLeftDiv>
			<ParamsBox/>
			<ZoomButtons/>
		</Fragment>
	);
};

export default observer(DomApp);
