import React, { FunctionComponent, ChangeEvent, FocusEvent, useState } from 'react';
import { observer } from 'mobx-react-lite';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMapMarked } from '@fortawesome/free-solid-svg-icons';

import { IDestinationParams } from 'src/models/DestinationParams';


type Props = {
	params: IDestinationParams,
};

const DestinationParam: FunctionComponent<Props> = ({ params }) => {
	const [destination, setDestination] = useState(params.destination);

	const onChange = (ev: ChangeEvent<HTMLInputElement>): void => {
		setDestination(ev.target.value);
		// we must cancel the potential previous invalid state
		// https://developer.mozilla.org/en-US/docs/Web/API/HTMLObjectElement/setCustomValidity
		ev.target.setCustomValidity('');

		const valid = ev.target.checkValidity();

		if (valid) {
			params.setDestination(ev.target.value);
		}
	};

	const onBlur = (ev: FocusEvent<HTMLInputElement>): void => {
		const valid = ev.target.checkValidity();
		if (!valid) {
			ev.target.setCustomValidity('Must be a level ID or empty');
			ev.target.reportValidity();
		}
	};

	return (
		<label>
			<FontAwesomeIcon icon={faMapMarked}/>
			&#32;
			destination:
			&#32;
			<input
				type="text"
				value={destination || ''}
				onChange={onChange} placeholder="Enter a level ID"
				pattern="[0-9a-fA-F]{8}-(?:[0-9a-fA-F]{4}-){3}[0-9a-fA-F]{12}"
				onBlur={onBlur}
			/>
		</label>
	);
};

export default observer(DestinationParam);
