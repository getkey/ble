import React, { FunctionComponent, ChangeEvent } from 'react';
import { observer } from 'mobx-react-lite';
import styled from '@emotion/styled';

import { useStore } from 'src/hooks/useStore';
import Box from 'src/components/Box';
import NumberInput from 'src/components/NumberInput';
import LoadSave from 'src/components/LoadSave';

const StarInput = styled(NumberInput)`
	width: 10ex;
`;

const ParamsBox: FunctionComponent = () => {
	const { level } = useStore();

	function on2StarsChange(value: number): void {
		level.set2StarsTime(value);
	}
	function on3StarsChange(value: number): void {
		level.set3StarsTime(value);
	}
	function onNameChange(ev: ChangeEvent<HTMLInputElement>): void {
		level.setName(ev.target.value);
	}

	return (
		<Box title={level.name}>
			<label>Level name: <input type="text"value={level.name} onChange={onNameChange}/></label>
			<label>2 stars: finish in <StarInput min="0" value={level.timings[0]} onChange={on2StarsChange}/> ms or less</label>
			<label>3 stars: finish in <StarInput min="0" value={level.timings[1]} onChange={on3StarsChange}/> ms or less</label>
			<LoadSave/>
		</Box>
	);
};

export default observer(ParamsBox);
