import React, { FunctionComponent, ChangeEvent } from 'react';
import styled from '@emotion/styled';
import { observer } from 'mobx-react-lite';
import { DEG_TO_RAD, RAD_TO_DEG } from 'pixi.js';

import { useStore } from 'src/hooks/useStore';
import NumberInput from 'src/components/NumberInput';

const AngleInput = styled(NumberInput)`
	width: 6ex;
`;

const Container = styled.div`
	display: flex;
	flex-direction: column;
`;

const AngleParam: FunctionComponent = () => {
	const { editor: { selectedEntity } } = useStore();

	if (
		selectedEntity === undefined ||
		!('params' in selectedEntity) ||
		!('setAngle' in selectedEntity) ||
		!('angle' in selectedEntity.params)
	) return null;

	const onChangeAngleSlider = (ev: ChangeEvent<HTMLInputElement>): void => {
		selectedEntity.setAngle(ev.target.valueAsNumber * DEG_TO_RAD);
	};

	const onChangeAngleInput = (angle: number): void => {
		selectedEntity.setAngle(angle * DEG_TO_RAD);
	};

	// remove floating point inaccuracies by flooring
	const angleDegrees = Math.floor(selectedEntity.params.angle * RAD_TO_DEG);

	return (
		<Container>
			<label>
				angle:
				<AngleInput
					min={-180}
					max={180}
					step={1}
					value={angleDegrees}
					onChange={onChangeAngleInput}
				/>
			</label>
			<input
				type="range"
				min="-180"
				max="180"
				step="1"
				value={angleDegrees}
				onChange={onChangeAngleSlider}
			/>
		</Container>
	);
};

export default observer(AngleParam);
