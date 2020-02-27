import React, { FunctionComponent, ChangeEvent } from 'react';
import { observer } from 'mobx-react-lite';
import { DEG_TO_RAD, RAD_TO_DEG } from 'pixi.js';
import styled from '@emotion/styled';

import { useStore } from 'src/hooks/useStore';
import { useDispatch } from 'src/hooks/useDispatch';
import Hoppi, { InfiniteParams, FiniteParams } from 'src/models/Hoppi';
import Door from 'src/models/Door';
import { AmmoType } from 'src/types/entity';
import Box from 'src/components/Box';
import { ammoAliases } from 'src/aliases';

const DeleteButton = styled.button`
	background-color: red;
	color: white;
`;

const ParamsBox: FunctionComponent<{}> = () => {
	const { editor: { selectedEntity } } = useStore();
	const dispatch = useDispatch();

	if (selectedEntity === undefined) return null;

	function onToggleStatic(ev: ChangeEvent<HTMLInputElement>): void {
		if (selectedEntity === undefined) return;
		if (Hoppi.is(selectedEntity)) throw new Error('Hoppis don\'t have isStatic');

		selectedEntity.setIsStatic(ev.target.checked);
	}

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

	function onChangeAngle(ev: ChangeEvent<HTMLInputElement>): void {
		if (selectedEntity === undefined) return;
		if (!Hoppi.is(selectedEntity) && !Door.is(selectedEntity)) {
			throw new Error('Neither door nor Hoppi');
		}
		selectedEntity.setAngle(parseInt(ev.target.value) * DEG_TO_RAD);
	}

	function onResetAngle(): void {
		if (selectedEntity === undefined) return;
		if (!Hoppi.is(selectedEntity) && !Door.is(selectedEntity)) {
			throw new Error('Neither door nor Hoppi');
		}
		selectedEntity.setAngle(0);
	}

	function onDelete(): void {
		if (selectedEntity === undefined) return;
		dispatch({
			type: 'deleteEntity',
			entityId: selectedEntity.id,
		});
	}

	return (
		<Box title={selectedEntity.displayName}>
			{Hoppi.is(selectedEntity) && (
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
			)}
			{!Hoppi.is(selectedEntity) &&  (
				<label>static: <input type="checkbox" checked={selectedEntity.params.isStatic} onChange={onToggleStatic}/></label>
			)}
			{(Hoppi.is(selectedEntity) || Door.is(selectedEntity)) && (
				<div>
					<label>angle: <input
						type="range"
						min="-180"
						max="180"
						step="1"
						onChange={onChangeAngle}
						value={selectedEntity.params.angle * RAD_TO_DEG}
					/></label>
					<button onClick={onResetAngle}>Reset angle</button>
				</div>
			)}
			<DeleteButton onClick={onDelete}>Delete entity</DeleteButton>
		</Box>
	);
};

export default observer(ParamsBox);
