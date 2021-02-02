import React, { FunctionComponent, ChangeEvent, FocusEvent } from 'react';
import { observer } from 'mobx-react-lite';
import styled from '@emotion/styled';

import { useStore } from 'src/hooks/useStore';
import NumberInput from 'src/components/NumberInput';
import LoadSave from 'src/components/LoadSave';
import HomeButton from 'src/components/HomeButton';

const StarInput = styled(NumberInput)`
	width: 7ex;
	appearance: textfield; /* removes the arrows */
	text-align: center;
`;

const StarBox = styled.div`
	display: flex;
`;

const StarColumn = styled.label`
	display: flex;
	flex-direction: column;
	align-items: center;
	width: 33.3333%;

	&::before {
		content: '★';
		font-size: 4ex;
	}
	&::after {
		content: 'secs';
	}
	&:first-child::after {
		content: none;
	}
`;

const Bar = styled.div`
	width: 100%;
	background-color: white;
	display: flex;
	justify-content: space-between;
`;

const Line = styled.div`
	display: flex;
`;

const LevelNameInput = styled.input`
	width: 15ex;
	font-size: 0.8em;
`;

const MenuBar: FunctionComponent = () => {
	const { level } = useStore();

	function on2StarsChange(value: number): void {
		level.set2StarsTime(value * 1000);
	}
	function on3StarsChange(value: number): void {
		level.set3StarsTime(value * 1000);
	}
	function onNameChange(ev: ChangeEvent<HTMLInputElement>): void {
		level.setName(ev.target.value);
	}
	function onNameBlur(ev: FocusEvent<HTMLInputElement>): void {
		ev.target.reportValidity();
	}

	return (
		<Bar>
			<Line>
				<LevelNameInput
					type="text"
					value={level.name}
					onChange={onNameChange}
					onBlur={onNameBlur}
					placeholder="Level name"
					required
				/>
				<StarBox>
					<StarColumn
						title="Finish the level to get 1 star"
					/>
					<StarColumn
						title={`Finish in ${level.timings[0] / 1000}s or less to get 2 stars`}
					>
						<StarInput
							min={0}
							step={0.001}
							value={level.timings[0] / 1000}
							onChange={on2StarsChange}
							required
						/>
					</StarColumn>
					<StarColumn
						title={`Finish in ${level.timings[1] / 1000}s or less to get 3 stars`}
					>
						<StarInput
							min={0}
							step={0.001}
							value={level.timings[1] / 1000}
							onChange={on3StarsChange}
							required
						/>
					</StarColumn>
				</StarBox>
			</Line>
			<Line>
				<LoadSave/>
				<HomeButton/>
			</Line>
		</Bar>
	);
};

export default observer(MenuBar);
