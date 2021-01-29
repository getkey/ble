import React, { FunctionComponent, ChangeEvent } from 'react';
import { observer } from 'mobx-react-lite';
import styled from '@emotion/styled';

import { IFiniteParams } from 'src/models/Hoppi';

const pattern = '^(?:b|B|g|G|e|E)*$';
const patternRegex = new RegExp(pattern);

const Input = styled.input`
	width: 10ex;
`;

type Props = {
	magazineParams: IFiniteParams;
}

const FiniteMagazineParam: FunctionComponent<Props> = ({ magazineParams }) => {
	const onChangeMagazine = (ev: ChangeEvent<HTMLInputElement>): void => {
		if (!patternRegex.test(ev.target.value)) {
			alert('The content of the magazine must be a string of \'g\' for Grenades, \'b\' for Bombs and \'e\' for Empty.');
			return;
		}

		magazineParams.setFromStringFormat(ev.target.value);
	};

	return (
		<Input type="text" pattern={pattern} value={magazineParams.stringFormat} onChange={onChangeMagazine}/>
	);
};

export default observer(FiniteMagazineParam);
