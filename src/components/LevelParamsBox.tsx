import React, { FunctionComponent, ChangeEvent } from 'react';
import { observer } from 'mobx-react-lite';
import styled from '@emotion/styled';

import { useStore } from 'src/hooks/useStore';
import Box, { Title, Content } from 'src/components/Box';
import NumberInput from 'src/components/NumberInput';
import LoadSave from 'src/components/LoadSave';

const StarInput = styled(NumberInput)`
	width: 7ex;
	appearance: textfield; /* removes the arrows */
`;

const StarBox = styled.div`
	display: flex;
`;

const StarColumn = styled.label`
	display: flex;
	flex-direction: column;
	width: 33.33%;
	align-items: center;

	&::before {
		content: '★';
		font-size: 4ex;
	}
	&::after {
		content: 'ms';
	}
	&:first-child::after {
		content: none;
	}
`;

const LevelNameInput = styled.input`
	width: 15ex;
	font-size: 0.8em;
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
		<Box>
			<Title>
				<LevelNameInput
					type="text"
					value={level.name}
					onChange={onNameChange}
					placeholder="Level name"
				/>
			</Title>
			<Content>
				<StarBox>
					<StarColumn
						title="Finish the level to get 1 star"
					/>
					<StarColumn
						title={`Finish in ${level.timings[0]}ms or less to get 2 stars`}
					>
						<StarInput min={0} value={level.timings[0]} onChange={on2StarsChange}/>
					</StarColumn>
					<StarColumn
						title={`Finish in ${level.timings[1]}ms or less to get 3 stars`}
					>
						<StarInput min={0} value={level.timings[1]} onChange={on3StarsChange}/>
					</StarColumn>
				</StarBox>
				<LoadSave/>
			</Content>
		</Box>
	);
};

export default observer(ParamsBox);
