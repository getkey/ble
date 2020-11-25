import React, { FunctionComponent, ChangeEvent } from 'react';
import { observer } from 'mobx-react-lite';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBomb } from '@fortawesome/free-solid-svg-icons';
import styled from '@emotion/styled';

import { useStore } from 'src/hooks/useStore';
import Hoppi from 'src/models/Hoppi';
import FiniteMagazineParam from 'src/components/FiniteMagazineParam';
import InfiniteMagazineParam from 'src/components/InfiniteMagazineParam';

const Container = styled.div`
	display: flex;
	align-items: center;
`;

const HoppiParam: FunctionComponent = () => {
	const { editor: { selectedEntity } } = useStore();

	if (!Hoppi.is(selectedEntity)) return null;

	const onChangeHoppiType = (ev: ChangeEvent<HTMLSelectElement>): void => {
		if (ev.target.value === 'infinite') {
			selectedEntity.makeInfinite();
		}
		if (ev.target.value === 'finite') {
			selectedEntity.makeFinite();
		}
	};

	return (
		<Container>
			<FontAwesomeIcon icon={faBomb}/>
			<select value={selectedEntity.entityType} onChange={onChangeHoppiType}>
				<option value="infinite">Infinite</option>
				<option value="finite">Finite</option>
			</select>
			<InfiniteMagazineParam/>
			<FiniteMagazineParam/>
		</Container>
	);
};

export default observer(HoppiParam);
