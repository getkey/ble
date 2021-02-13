import React, { FunctionComponent } from 'react';
import { observer } from 'mobx-react-lite';
import styled from '@emotion/styled';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircle } from '@fortawesome/free-regular-svg-icons';

import NumberInput from 'src/components/NumberInput';
import InfiniteRange from 'src/components/InfiniteRange';
import { IRadiusParams } from 'src/models/RadiusParams';

const RadiusInput = styled(NumberInput)`
	width: 8ex;
`;

const Container = styled.div`
	display: flex;
	flex-direction: column;
`;

type Props = {
	params: IRadiusParams,
};

const RadiusParam: FunctionComponent<Props> = ({ params }) => {
	const onChangeRadius = (radius: number): void => {
		params.setRadius(radius);
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
					value={params.radius}
					onChange={onChangeRadius}
				/>
			</label>
			<InfiniteRange
				value={params.radius}
				min={1}
				step={1}
				onChange={onChangeRadius}
			/>
		</Container>
	);
};

export default observer(RadiusParam);
