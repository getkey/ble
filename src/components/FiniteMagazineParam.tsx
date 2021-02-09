import React, { FunctionComponent, ChangeEvent } from 'react';
import { observer } from 'mobx-react-lite';
import styled from '@emotion/styled';

import { IFiniteParams } from 'src/models/Hoppi';

const Input = styled.input`
	width: 10ex;
`;

type Props = {
	magazineParams: IFiniteParams;
}

const FiniteMagazineParam: FunctionComponent<Props> = ({ magazineParams }) => {
	const onChangeMagazine = (ev: ChangeEvent<HTMLInputElement>): void => {
		// we must cancel the potential previous invalid state
		// https://developer.mozilla.org/en-US/docs/Web/API/HTMLObjectElement/setCustomValidity
		ev.target.setCustomValidity('');

		const valid = ev.target.checkValidity();

		if (valid) {
			magazineParams.setFromStringFormat(ev.target.value);
		} else {
			ev.target.setCustomValidity('Must be a string of \'g\' for Grenades, \'b\' for Bombs and \'e\' for Empty slots.');
			ev.target.reportValidity();
		}
	};

	return (
		<Input type="text" pattern="^[bBgGeE]*$" value={magazineParams.stringFormat} onChange={onChangeMagazine}/>
	);
};

export default observer(FiniteMagazineParam);
