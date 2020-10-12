import React, { FunctionComponent, ChangeEvent } from 'react';
import { observer } from 'mobx-react-lite';

import { useStore } from 'src/hooks/useStore';
import Hoppi from 'src/models/Hoppi';
import FiniteMagazineParam from 'src/components/FiniteMagazineParam';
import InfiniteMagazineParam from 'src/components/InfiniteMagazineParam';

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
		<div>
			<select value={selectedEntity.entityType} onChange={onChangeHoppiType}>
				<option value="infinite">Infinite ammo</option>
				<option value="finite">Finite ammo</option>
			</select>
			<InfiniteMagazineParam/>
			<FiniteMagazineParam/>
		</div>
	);
};

export default observer(HoppiParam);
