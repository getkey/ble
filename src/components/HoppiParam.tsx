import React, { FunctionComponent, ChangeEvent } from 'react';
import { observer } from 'mobx-react-lite';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBomb } from '@fortawesome/free-solid-svg-icons';
import styled from '@emotion/styled';

import { InfiniteParams, FiniteParams, IHoppi } from 'src/models/Hoppi';
import FiniteMagazineParam from 'src/components/FiniteMagazineParam';
import InfiniteMagazineParam from 'src/components/InfiniteMagazineParam';

const Container = styled.div`
	display: flex;
	align-items: center;
`;

type Props = {
	hoppi: IHoppi,
};

const HoppiParam: FunctionComponent<Props> = ({ hoppi }) => {
	const onChangeHoppiType = (ev: ChangeEvent<HTMLSelectElement>): void => {
		if (ev.target.value === 'infinite') {
			hoppi.makeInfinite();
		}
		if (ev.target.value === 'finite') {
			hoppi.makeFinite();
		}
	};

	return (
		<Container>
			<FontAwesomeIcon icon={faBomb}/>
			<select value={hoppi.entityType} onChange={onChangeHoppiType}>
				<option value="infinite">Infinite</option>
				<option value="finite">Finite</option>
			</select>
			{InfiniteParams.is(hoppi.params) && (
				<InfiniteMagazineParam magazineParams={hoppi.params}/>
			)}
			{FiniteParams.is(hoppi.params) && (
				<FiniteMagazineParam magazineParams={hoppi.params}/>
			)}
		</Container>
	);
};

export default observer(HoppiParam);
