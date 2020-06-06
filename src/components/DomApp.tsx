import React, { FunctionComponent, ChangeEvent, Fragment } from 'react';
import styled from '@emotion/styled';
import { observer } from 'mobx-react-lite';

import { useStore } from 'src/hooks/useStore';
import ModeBar from 'src/components/ModeBar';
import ParamsBox from 'src/components/ParamsBox';
import CursorStyle from 'src/components/CursorStyle';
import LoadSave from 'src/components/LoadSave';
import ZoomButtons from 'src/components/ZoomButtons';
import NumberInput from 'src/components/NumberInput';

const BottomLeftDiv = styled.div`
	padding: 4px;
	position: absolute;
	bottom: 0;
	left: 0;
	background-color: white;
	display: flex;
	flex-direction: column;
	align-items: flex-start; /* prevent stretching*/
`;

const StarInput = styled(NumberInput)`
	width: 10ex;
`;

const DomApp: FunctionComponent = () => {
	const { level, editor } = useStore();

	function on2StarsChange(value: number): void {
		level.set2StarsTime(value);
	}
	function on3StarsChange(value: number): void {
		level.set3StarsTime(value);
	}
	function onCellSizeChange(value: number): void {
		editor.setGridCellSize(value);
	}
	function onNameChange(ev: ChangeEvent<HTMLInputElement>): void {
		level.setName(ev.target.value);
	}

	return (
		<Fragment>
			<CursorStyle/>
			<ModeBar/>
			<BottomLeftDiv>
				<label>Level name: <input type="text"value={level.name} onChange={onNameChange}/></label>
				<label>2 stars: finish in <StarInput min="0" value={level.timings[0]} onChange={on2StarsChange}/> ms or less</label>
				<label>3 stars: finish in <StarInput min="0" value={level.timings[1]} onChange={on3StarsChange}/> ms or less</label>
				<label>Grid size: <NumberInput min="0" value={editor.gridCellSize} onChange={onCellSizeChange}/></label>
				<LoadSave/>
			</BottomLeftDiv>
			<ParamsBox/>
			<ZoomButtons/>
		</Fragment>
	);
};

export default observer(DomApp);
