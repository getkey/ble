import React, { FunctionComponent, Fragment, ChangeEvent } from 'react';
import { observer } from 'mobx-react-lite';
import styled from '@emotion/styled';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faLayerGroup } from '@fortawesome/free-solid-svg-icons';

import { useStore } from 'src/hooks/useStore';
import Vertex from 'src/models/Vertex';
import Hoppi from 'src/models/Hoppi';
import NumberInput from 'src/components/NumberInput';

const OrderInput = styled(NumberInput)`
	width: 6ex;
`;

const Tip = styled.p`
	margin-bottom: 0;
`;

const Container = styled.div`
	display: flex;
	flex-direction: column;
`;

const ZOrderParam: FunctionComponent = () => {
	const { editor, level } = useStore();
	const { selectedEntity } = editor;

	if (selectedEntity === undefined || Vertex.is(selectedEntity)) return null;

	const position = level.getEntityPosition(selectedEntity);

	const onChange = (newPosition: number): void => {
		level.move(selectedEntity, newPosition - 1);
	};
	const onChangeSlider = (ev: ChangeEvent<HTMLInputElement>): void => {
		level.move(selectedEntity, ev.target.valueAsNumber - 1);
	};

	const posDisplay = position + 1;
	return (
		<Fragment>
			<Container>
				<label>
					<FontAwesomeIcon icon={faLayerGroup}/>
					&#32;
					z-order:
					&#32;
					<OrderInput
						value={posDisplay}
						min={1}
						max={level.entities.length}
						step={1}
						onChange={onChange}
					/>
				</label>
				<input
					type="range"
					min="1"
					max={level.entities.length}
					step="1"
					value={posDisplay}
					onChange={onChangeSlider}
				/>
			</Container>
			{Hoppi.is(selectedEntity) && (
				<Tip>Tip: the lowest hoppi holds the camera</Tip>
			)}
		</Fragment>
	);
};

export default observer(ZOrderParam);
