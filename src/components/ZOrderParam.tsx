import React, { FunctionComponent, Fragment, ChangeEvent } from 'react';
import { observer } from 'mobx-react-lite';
import styled from '@emotion/styled';

import { useStore } from 'src/hooks/useStore';
import Vertex from 'src/models/Vertex';
import Hoppi from 'src/models/Hoppi';
import NumberInput from 'src/components/NumberInput';

const OrderInput = styled(NumberInput)`
	width: 6ex;
`;


const Tip = styled.p`
	margin-top: 0.1em;
`;

const ZOrderParam: FunctionComponent = () => {
	const { editor, level } = useStore();
	const { selectedEntity } = editor;

	if (selectedEntity === undefined || Vertex.is(selectedEntity)) return null;

	const position = level.getEntityPosition(selectedEntity);

	function onChange(newPosition: number): void {
		if (selectedEntity === undefined || Vertex.is(selectedEntity)) return;

		level.move(selectedEntity, newPosition - 1);
		editor.setSelectedEntity(selectedEntity);
	}
	function onChangeSlider(ev: ChangeEvent<HTMLInputElement>): void {
		if (selectedEntity === undefined || Vertex.is(selectedEntity)) return;

		level.move(selectedEntity, ev.target.valueAsNumber - 1);
		editor.setSelectedEntity(selectedEntity);
	}

	const posDisplay = position + 1;
	return (
		<Fragment>
			<div>
				<label>z-order: <OrderInput
					value={posDisplay}
					min={1}
					max={level.entities.length}
					step={1}
					onChange={onChange}
				/></label>
				<input
					type="range"
					min="1"
					max={level.entities.length}
					step="1"
					value={posDisplay}
					onChange={onChangeSlider}
				/>
			</div>
			{Hoppi.is(selectedEntity) && (
				<Tip>Tip: the lowest hoppi holds the camera</Tip>
			)}
		</Fragment>
	);
};

export default observer(ZOrderParam);
