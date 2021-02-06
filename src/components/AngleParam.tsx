import React, { FunctionComponent, ChangeEvent } from 'react';
import styled from '@emotion/styled';
import { observer } from 'mobx-react-lite';
import { DEG_TO_RAD, RAD_TO_DEG } from 'pixi.js';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faRulerCombined } from '@fortawesome/free-solid-svg-icons';

import NumberInput from 'src/components/NumberInput';
import { useStore } from 'src/hooks/useStore';

const AngleInput = styled(NumberInput)`
	width: 6ex;
`;

const Container = styled.div`
	display: flex;
	flex-direction: column;
`;

interface AngleEntity {
	params: {
		angle: number;
	}
	setAngle: (angle: number) => void;
}

type Props = {
	angleEntity: AngleEntity,
};

const AngleParam: FunctionComponent<Props> = ({ angleEntity }) => {
	const { undoManager } = useStore();

	const onChangeAngleSlider = (ev: ChangeEvent<HTMLInputElement>): void => {
		angleEntity.setAngle(ev.target.valueAsNumber * DEG_TO_RAD);
	};

	const onChangeAngleInput = (angle: number): void => {
		angleEntity.setAngle(angle * DEG_TO_RAD);
	};

	function onFocus(): void {
		// eslint-disable-next-line @typescript-eslint/no-empty-function
		undoManager.startGroup(() => {});
	}
	function onBlur(): void {
		undoManager.stopGroup();
	}

	// remove floating point inaccuracies by flooring
	const angleDegrees = Math.floor(angleEntity.params.angle * RAD_TO_DEG);

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
