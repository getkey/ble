import React, { FunctionComponent, ChangeEvent } from 'react';
import styled from '@emotion/styled';
import { observer } from 'mobx-react-lite';
import { DEG_TO_RAD, RAD_TO_DEG } from 'pixi.js';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faRulerCombined } from '@fortawesome/free-solid-svg-icons';

import NumberInput from 'src/components/NumberInput';
import { useStore } from 'src/hooks/useStore';
import { IAngleParams } from 'src/models/AngleParams';

const AngleInput = styled(NumberInput)`
	width: 6ex;
`;

const Container = styled.div`
	display: flex;
	flex-direction: column;
`;

type Props = {
	params: IAngleParams,
};

const AngleParam: FunctionComponent<Props> = ({ params }) => {
	const { undoManager } = useStore();

	const onChangeAngleSlider = (ev: ChangeEvent<HTMLInputElement>): void => {
		params.setAngle(ev.target.valueAsNumber * DEG_TO_RAD);
	};

	const onChangeAngleInput = (angle: number): void => {
		params.setAngle(angle * DEG_TO_RAD);
	};

	function onFocus(): void {
		undoManager.startGroup();
	}
	function onBlur(): void {
		undoManager.stopGroup();
	}

	// remove floating point inaccuracies by flooring
	const angleDegrees = Math.floor(params.angle * RAD_TO_DEG);

	return (
		<Container>
			<label>
				<FontAwesomeIcon icon={faRulerCombined}/>
				&#32;
				angle:
				&#32;
				<AngleInput
					min={-180}
					max={180}
					step={1}
					value={angleDegrees}
					onChange={onChangeAngleInput}
					onFocus={onFocus}
					onBlur={onBlur}
				/>
			</label>
			<input
				type="range"
				min="-180"
				max="180"
				step="1"
				value={angleDegrees}
				onChange={onChangeAngleSlider}
				onFocus={onFocus}
				onBlur={onBlur}
			/>
		</Container>
	);
};

export default observer(AngleParam);
