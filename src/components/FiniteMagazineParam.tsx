import React, { FunctionComponent, ChangeEvent } from 'react';
import { observer } from 'mobx-react-lite';

import { useStore } from 'src/hooks/useStore';
import Hoppi, { FiniteParams } from 'src/models/Hoppi';

const pattern = '^(?:b|B|g|G|e|E)*$';
const patternRegex = new RegExp(pattern);

const FiniteMagazineParam: FunctionComponent = () => {
	const { editor: { selectedEntity } } = useStore();

	if (
		!Hoppi.is(selectedEntity) ||
		!FiniteParams.is(selectedEntity.params)
	) return null;

	const onChangeMagazine = (ev: ChangeEvent<HTMLInputElement>): void => {
		// TODO: figure out why this line below is necessary
		if (!FiniteParams.is(selectedEntity.params)) throw new Error('Params aren\'t finite');
		if (!patternRegex.test(ev.target.value)) {
			alert('The content of the magazine must be a string of \'g\' for Grenades, \'b\' for Bombs and \'e\' for Empty.');
			return;
		}

		selectedEntity.params.setFromStringFormat(ev.target.value);
	};

	return (
		<input type="text" pattern={pattern} value={selectedEntity.params.stringFormat} onChange={onChangeMagazine}/>
	);
};

export default observer(FiniteMagazineParam);
