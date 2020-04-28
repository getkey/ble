import React, { FunctionComponent, ChangeEvent, useState, useEffect, FocusEvent } from 'react';

type Props = {
	value: number | string;
	onChange?: (ev: ChangeEvent<HTMLInputElement>) => void;
	onBlur?: (ev: FocusEvent<HTMLInputElement>) => void;
	[index: string]: unknown;
};

// this is a number input that can temporarily contain invalid values such as '' or '12enoen'
const NumberInput: FunctionComponent<Props> = ({ value, onChange, onBlur, ...props }) => {
	const [innerValue, setInnerValue] = useState(value);

	useEffect(() => {
		setInnerValue(value);
	}, [value]);

	function onInnerChange(ev: ChangeEvent<HTMLInputElement>): void {
		if (!isNaN(ev.target.valueAsNumber) && onChange !== undefined) {
			onChange(ev);
		}

		setInnerValue(ev.target.value);
	}

	// put the latest correct value when losing focus
	function onInnerBlur(ev: FocusEvent<HTMLInputElement>): void {
		setInnerValue(value);

		if (onBlur !== undefined) {
			onBlur(ev);
		}
	}

	return (
		<input {...props} type="number" value={innerValue} onChange={onInnerChange} onBlur={onInnerBlur}/>
	);
};

export default NumberInput;
