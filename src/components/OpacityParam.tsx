import React, { FunctionComponent, ChangeEvent } from 'react';
import { observer } from 'mobx-react-lite';
import styled from '@emotion/styled';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faDroplet } from '@fortawesome/free-solid-svg-icons';

import { useStore } from 'src/hooks/useStore';
import NumberInput from 'src/components/NumberInput';
import { IOpacityParams } from 'src/models/OpacityParams';

const OpacityInput = styled(NumberInput)`
	width: 6ex;
`;

const Container = styled.div`
	display: flex;
	flex-direction: column;
`;

type Props = {
	params: IOpacityParams,
};

const ZOrderParam: FunctionComponent<Props> = ({ params }) => {
	const { undoManager } = useStore();

	const onChange = (newOpacity: number): void => {
		params.setOpacity(newOpacity);
	};

	function onFocus(): void {
		undoManager.startGroup();
	}
	function onBlur(): void {
		undoManager.stopGroup();
	}

	const min = 0;
	const max = 1;
	const step = 0.01;


	return (
		<Container>
			<label>
				<FontAwesomeIcon icon={faDroplet}/>
				&#32;
				opacity:
				&#32;
				<OpacityInput
					value={params.opacity}
					min={min}
					max={max}
					step={step}
					onChange={onChange}
					onFocus={onFocus}
					onBlur={onBlur}
				/>
			</label>
			<input
				type="range"
				min={min}
				max={max}
				step={step}
				value={params.opacity}
				onChange={(ev: ChangeEvent<HTMLInputElement>) => onChange(ev.target.valueAsNumber)}
				onFocus={onFocus}
				onBlur={onBlur}
			/>
		</Container>
	);
};

export default observer(ZOrderParam);
