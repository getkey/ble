import React, { FunctionComponent } from 'react';
import { observer } from 'mobx-react-lite';
import styled from '@emotion/styled';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircle } from '@fortawesome/free-regular-svg-icons';

import NumberInput from 'src/components/NumberInput';
import InfiniteRange from 'src/components/InfiniteRange';

const RadiusInput = styled(NumberInput)`
	width: 8ex;
`;

const Container = styled.div`
	display: flex;
	flex-direction: column;
`;

interface RadiusEntity {
	params: {
		radius: number;
	}
	setRadius: (radius: number) => void;
}

type Props = {
	radiusEntity: RadiusEntity,
};

const RadiusParam: FunctionComponent<Props> = ({ radiusEntity }) => {
	const onChangeRadius = (radius: number): void => {
		radiusEntity.setRadius(radius);
	};

	return (
		<Container>
			<label>
				<FontAwesomeIcon icon={faCircle}/>
				&#32;
				radius:
				&#32;
				<RadiusInput
					min={1}
					step={1}
					value={radiusEntity.params.radius}
					onChange={onChangeRadius}
				/>
			</label>
			<InfiniteRange
				value={radiusEntity.params.radius}
				min={1}
				step={1}
				onChange={onChangeRadius}
			/>
		</Container>
	);
};

export default observer(RadiusParam);
