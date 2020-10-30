import React, { FunctionComponent } from 'react';
import { observer } from 'mobx-react-lite';
import styled from '@emotion/styled';

import { useStore } from 'src/hooks/useStore';
import NumberInput from 'src/components/NumberInput';
import InfiniteRange from 'src/components/InfiniteRange';

const RadiusInput = styled(NumberInput)`
	width: 8ex;
`;

const Container = styled.div`
	display: flex;
	flex-direction: column;
`;

const RadiusParam: FunctionComponent = () => {
	const { editor: { selectedEntity } } = useStore();

	if (
		selectedEntity === undefined ||
		!('params' in selectedEntity) ||
		!('setRadius' in selectedEntity) ||
		!('radius' in selectedEntity.params)
	) return null;

	const onChangeRadius = (radius: number): void => {
		selectedEntity.setRadius(radius);
	};

	return (
		<Container>
			<label>
				radius:
				<RadiusInput
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
		</Container>
	);
};

export default observer(RadiusParam);
