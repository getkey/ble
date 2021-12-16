import React, { FunctionComponent, ChangeEvent, FocusEvent, useState, useEffect } from 'react';
import { observer } from 'mobx-react-lite';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faLink } from '@fortawesome/free-solid-svg-icons';

import { IDestinationParams, doorDestinationRegex } from 'src/models/DestinationParams';


type Props = {
	params: IDestinationParams,
};

const DestinationParam: FunctionComponent<Props> = ({ params }) => {
	const [destination, setDestination] = useState(params.destination);

	useEffect(() => {
		setDestination(params.destination);
	}, [params.destination]);

	const onChange = (ev: ChangeEvent<HTMLInputElement>): void => {
		setDestination(ev.target.value);
		// we must cancel the potential previous invalid state
		// https://developer.mozilla.org/en-US/docs/Web/API/HTMLObjectElement/setCustomValidity
		ev.target.setCustomValidity('');

		const valid = ev.target.checkValidity();

		if (valid) {
			const value = ev.target.value === '' ? undefined : ev.target.value;
			params.setDestination(value);
		}
	};

	const onBlur = (ev: FocusEvent<HTMLInputElement>): void => {
		const valid = ev.target.checkValidity();
		if (!valid) {
			ev.target.setCustomValidity('Must be a level URL or a level ID');
			ev.target.reportValidity();
		}
	};

	return (
		<label title="The level where this door leads. Leave empty to go to the menu.">
			<FontAwesomeIcon icon={faLink}/>
			&#32;
			destination level:
			&#32;
			<input
				type="text"
				value={destination || ''}
				onChange={onChange} placeholder="https://bombhopper.io/?level=b3cd72ad-e47c-4aac-a720-3ea871d0330c"
				pattern={doorDestinationRegex.source}
				onBlur={onBlur}
			/>
		</label>
	);
};

export default observer(DestinationParam);
