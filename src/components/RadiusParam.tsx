import React, { FunctionComponent } from 'react';
import { observer } from 'mobx-react-lite';

import { useStore } from 'src/hooks/useStore';
import Ball from 'src/models/Ball';
import NumberInput from 'src/components/NumberInput';
import InfiniteRange from 'src/components/InfiniteRange';

const RadiusParam: FunctionComponent = () => {
	const { editor: { selectedEntity } } = useStore();

	if (!Ball.is(selectedEntity)) return null;


	function onChangeRadius(radius: number): void {
		if (selectedEntity === undefined) return;
		if (!Ball.is(selectedEntity)) {
			throw new Error('Not a ball!');
		}
		selectedEntity.setRadius(radius);
	}

	return (
		<div>
			<label>
				radius:
				<NumberInput
					min={1}
					step={1}
					value={selectedEntity.params.radius}
					onChange={onChangeRadius}
				/>
			</label>
			<InfiniteRange
				value={selectedEntity.params.radius}
				min={1}
				step={1}
				onChange={onChangeRadius}
			/>
		</div>
	);
};

export default observer(RadiusParam);
