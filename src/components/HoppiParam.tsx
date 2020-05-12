import React, { FunctionComponent, ChangeEvent } from 'react';
import { observer } from 'mobx-react-lite';

import { useStore } from 'src/hooks/useStore';
import Hoppi, { InfiniteParams, FiniteParams } from 'src/models/Hoppi';
import { AmmoType } from 'src/types/entity';
import { ammoAliases } from 'src/aliases';


const HoppiParam: FunctionComponent<{}> = () => {
	const { editor: { selectedEntity } } = useStore();

	if (selectedEntity === undefined || !Hoppi.is(selectedEntity)) return null;

	function onChangeHoppiType(ev: ChangeEvent<HTMLSelectElement>): void {
		if (selectedEntity === undefined) return;
		if (!Hoppi.is(selectedEntity)) throw new Error('Not a hoppi');

		if (ev.target.value === 'infinite') {
			selectedEntity.makeInfinite();
		}
		if (ev.target.value === 'finite') {
			selectedEntity.makeFinite();
		}
	}

	function onInfiniteAmmoChange(ev: ChangeEvent<HTMLSelectElement>): void {
		if (selectedEntity === undefined) return;
		if (!Hoppi.is(selectedEntity)) throw new Error('Not a hoppi');
		if (!InfiniteParams.is(selectedEntity.params)) throw new Error('Params aren\'t infinite');

		selectedEntity.params.setInfiniteType(ev.target.value as AmmoType);
	}

	const pattern = '^(?:b|g)*$';

	function onChangeMagazine(ev: ChangeEvent<HTMLInputElement>): void {
		if (selectedEntity === undefined) return;
		if (!Hoppi.is(selectedEntity)) throw new Error('Not a hoppi');
		if (!FiniteParams.is(selectedEntity.params)) throw new Error('Params aren\'t finite');

		if (!new RegExp(pattern).test(ev.target.value)) {
			alert('The content of the magazine must be a string of \'g\' for Grenades and \'b\' for Bombs.');
		} else {
			selectedEntity.params.setFromStringFormat(ev.target.value);
		}
	}

	return (
		<div>
			<select value={selectedEntity.entityType} onChange={onChangeHoppiType}>
				<option value="infinite">Infinite ammo</option>
				<option value="finite">Finite ammo</option>
			</select>
			{InfiniteParams.is(selectedEntity.params) && (
				<select value={selectedEntity.params.infiniteAmmo} onChange={onInfiniteAmmoChange}>
					{Object.values(AmmoType).map((ammo) => (
						<option value={ammo} key={ammo}>{ammoAliases[ammo]}</option>
					))}
				</select>
			)}
			{FiniteParams.is(selectedEntity.params) && (
				<input type="text" pattern={pattern} value={selectedEntity.params.stringFormat} onChange={onChangeMagazine}/>
			)}
		</div>
	);
};

export default observer(HoppiParam);
