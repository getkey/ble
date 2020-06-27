import React, { FunctionComponent, ChangeEvent } from 'react';
import styled from '@emotion/styled';
import { observer } from 'mobx-react-lite';
import { DEG_TO_RAD, RAD_TO_DEG } from 'pixi.js';

import { useStore } from 'src/hooks/useStore';
import Hoppi from 'src/models/Hoppi';
import Door from 'src/models/Door';
import Text from 'src/models/Text';
import NumberInput from 'src/components/NumberInput';

const AngleInput = styled(NumberInput)`
	width: 6ex;
`;

const AngleParam: FunctionComponent = () => {
	const { editor: { selectedEntity } } = useStore();

	if (!(Hoppi.is(selectedEntity) || Door.is(selectedEntity) || Text.is(selectedEntity)) || selectedEntity === undefined) return null;

	function onChangeAngleSlider(ev: ChangeEvent<HTMLInputElement>): void {
		if (selectedEntity === undefined) return;
		if (!Hoppi.is(selectedEntity) && !Door.is(selectedEntity) && !Text.is(selectedEntity)) {
			throw new Error('Neither door, Hoppi nor text');
		}
		selectedEntity.setAngle(ev.target.valueAsNumber * DEG_TO_RAD);
	}

	function onChangeAngleInput(angle: number): void {
		if (selectedEntity === undefined) return;
		if (!Hoppi.is(selectedEntity) && !Door.is(selectedEntity) && !Text.is(selectedEntity)) {
			throw new Error('Neither door, Hoppi nor text');
		}
		selectedEntity.setAngle(angle * DEG_TO_RAD);
	}

	// remove floating point inaccuracies by flooring
	const angleDegrees = Math.floor(selectedEntity.params.angle * RAD_TO_DEG);

	return (
		<div>
			<label>
				angle:
				<AngleInput
					min="-180"
					max="180"
					step="1"
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
		</div>
	);
};

export default observer(AngleParam);
