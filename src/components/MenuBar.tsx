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
	display: table-cell;
`;

const Bar = styled.div`
	background-color: white; /* important when the background is black when in an iframe */
	width: 100%;
	display: flex;
	flex-wrap: wrap;
	justify-content: space-between;
	padding: 0 0.3em;
	box-sizing: border-box; /* to make the padding on the right work */
`;

const Line = styled.div`
	display: flex;
	align-items: center;
`;

const LevelNameInput = styled.input`
	max-width: 15ex;
	font-size: 1.2em;
`;

const Table = styled.div`
	display: table;
	margin-left: 0.5em;
`;
const TableRow = styled.label`
	display: table-row;
`;

const Text = styled.span`
	display: table-cell;
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
				<Table>
					<TableRow
						title={`Finish in ${level.timings[0] / 1000}s or less to get 2 stars`}
					>
						<Text>★★</Text>
						<StarInput
							min={0}
							step={0.001}
							value={level.timings[0] / 1000}
							onChange={on2StarsChange}
							required
						/>
						<Text>secs</Text>
					</TableRow>
					<TableRow
						title={`Finish in ${level.timings[1] / 1000}s or less to get 3 stars`}
					>
						<Text>★★★</Text>
						<StarInput
							min={0}
							step={0.001}
							value={level.timings[1] / 1000}
							onChange={on3StarsChange}
							required
						/>
						<Text>secs</Text>
					</TableRow>
				</Table>
			</Line>
			<Line>
				<LoadSave/>
				<HomeButton/>
			</Line>
		</Bar>
	);
};

export default observer(MenuBar);
