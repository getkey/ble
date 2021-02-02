import React, { FunctionComponent, ChangeEvent } from 'react';
import { observer } from 'mobx-react-lite';

import { IInfiniteParams } from 'src/models/Hoppi';
import { AmmoType } from 'src/types/entity';
import { ammoAliases } from 'src/aliases';

type Props = {
	magazineParams: IInfiniteParams;
}

const InfiniteMagazineParam: FunctionComponent<Props> = ({ magazineParams }) => {
	const onInfiniteAmmoChange = (ev: ChangeEvent<HTMLSelectElement>): void => {
		magazineParams.setInfiniteType(ev.target.value as AmmoType);
	};

	return (
		<select value={magazineParams.infiniteAmmo} onChange={onInfiniteAmmoChange}>
			{Object.values(AmmoType).filter((ammo) => ammo !== AmmoType.empty).map((ammo) => (
				<option value={ammo} key={ammo}>{ammoAliases[ammo]}</option>
			))}
		</select>
	);
};

export default observer(InfiniteMagazineParam);
