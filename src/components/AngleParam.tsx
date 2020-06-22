import React, { FunctionComponent, ChangeEvent } from 'react';
import { observer } from 'mobx-react-lite';
import { DEG_TO_RAD, RAD_TO_DEG } from 'pixi.js';

import { useStore } from 'src/hooks/useStore';
import Hoppi from 'src/models/Hoppi';
import Door from 'src/models/Door';
import Text from 'src/models/Text';

const AngleParam: FunctionComponent = () => {
	const { editor: { selectedEntity } } = useStore();

	if (!(Hoppi.is(selectedEntity) || Door.is(selectedEntity) || Text.is(selectedEntity)) || selectedEntity === undefined) return null;

	function onChangeAngle(ev: ChangeEvent<HTMLInputElement>): void {
		if (selectedEntity === undefined) return;
		if (!Hoppi.is(selectedEntity) && !Door.is(selectedEntity) && !Text.is(selectedEntity)) {
			throw new Error('Neither door, Hoppi nor text');
		}
		selectedEntity.setAngle(ev.target.valueAsNumber * DEG_TO_RAD);
	}

	function onResetAngle(): void {
		if (selectedEntity === undefined) return;
		if (!Hoppi.is(selectedEntity) && !Door.is(selectedEntity) && !Text.is(selectedEntity)) {
			throw new Error('Neither door, Hoppi nor text');
		}
		selectedEntity.setAngle(0);
	}

	return (
		<div>
			<label>angle: <input
				type="range"
				min="-180"
				max="180"
				step="1"
				onChange={onChangeAngle}
				value={selectedEntity.params.angle * RAD_TO_DEG}
			/></label>
			<button onClick={onResetAngle}>Reset angle</button>
		</div>
	);
};

export default observer(AngleParam);
