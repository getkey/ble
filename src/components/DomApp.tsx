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

const DomApp: FunctionComponent<{}> = () => {
	const { level, editor } = useStore();

	function on2StarsChange(ev: ChangeEvent<HTMLInputElement>): void {
		level.set2StarsTime(ev.target.valueAsNumber);
	}
	function on3StarsChange(ev: ChangeEvent<HTMLInputElement>): void {
		level.set3StarsTime(ev.target.valueAsNumber);
	}
	function onCellSizeChange(ev: ChangeEvent<HTMLInputElement>): void {
		editor.setGridCellSize(ev.target.valueAsNumber);
	}
	function onNameChange(ev: ChangeEvent<HTMLInputElement>): void {
		level.setName(ev.target.value);
	}

	return (
		<Fragment>
			<CursorStyle/>
			<ModeBar/>
			<BottomLeftDiv>
				<label>Level name<input type="text"value={level.name} onChange={onNameChange}/></label>
				<label>Time to get 2 stars: <NumberInput min="0" value={level.timings[0]} onChange={on2StarsChange}/> ms</label>
				<label>Time to get 3 stars: <NumberInput min="0" value={level.timings[1]} onChange={on3StarsChange}/> ms</label>
				<label>Grid size: <NumberInput min="0" value={editor.gridCellSize} onChange={onCellSizeChange}/></label>
				<LoadSave/>
			</BottomLeftDiv>
			<ParamsBox/>
			<ZoomButtons/>
		</Fragment>
	);
};

export default observer(DomApp);
