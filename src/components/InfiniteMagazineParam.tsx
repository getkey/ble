import React, { FunctionComponent, ChangeEvent } from 'react';
import { observer } from 'mobx-react-lite';

import { useStore } from 'src/hooks/useStore';
import Hoppi, { InfiniteParams } from 'src/models/Hoppi';
import { AmmoType } from 'src/types/entity';
import { ammoAliases } from 'src/aliases';

const InfiniteMagazineParam: FunctionComponent = () => {
	const { editor: { selectedEntity } } = useStore();

	if (
		!Hoppi.is(selectedEntity) ||
		!InfiniteParams.is(selectedEntity.params)
	) return null;

	const onInfiniteAmmoChange = (ev: ChangeEvent<HTMLSelectElement>): void => {
		// TODO: figure out why this line below is necessary
		if (!InfiniteParams.is(selectedEntity.params)) throw new Error('Params aren\'t infinite');

		selectedEntity.params.setInfiniteType(ev.target.value as AmmoType);
	};

	return (
		<select value={selectedEntity.params.infiniteAmmo} onChange={onInfiniteAmmoChange}>
			{Object.values(AmmoType).filter((ammo) => ammo !== AmmoType.empty).map((ammo) => (
				<option value={ammo} key={ammo}>{ammoAliases[ammo]}</option>
			))}
		</select>
	);
};

export default observer(InfiniteMagazineParam);
