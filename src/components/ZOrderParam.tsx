import React, { FunctionComponent, Fragment, ChangeEvent } from 'react';
import { observer } from 'mobx-react-lite';
import styled from '@emotion/styled';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faLayerGroup } from '@fortawesome/free-solid-svg-icons';

import { useStore } from 'src/hooks/useStore';
import { IEntity } from 'src/models/Entity';
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

type Props = {
	entity: IEntity,
};

const ZOrderParam: FunctionComponent<Props> = ({ entity }) => {
	const { level } = useStore();

	const position = level.getEntityPosition(entity);

	const onChange = (newPosition: number): void => {
		level.move(entity, newPosition - 1);
	};
	const onChangeSlider = (ev: ChangeEvent<HTMLInputElement>): void => {
		level.move(entity, ev.target.valueAsNumber - 1);
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
			{Hoppi.is(entity) && (
				<Tip>Tip: the lowest hoppi holds the camera</Tip>
			)}
		</Fragment>
	);
};

export default observer(ZOrderParam);
