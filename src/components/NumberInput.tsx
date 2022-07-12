import React, { FunctionComponent, ChangeEvent, FocusEvent, useEffect, useReducer } from 'react';

import { isMultiple } from 'src/utils/math';

type Props = {
	value: number;
	onChange?: (value: number) => void;
	onBlur?: (ev: FocusEvent<HTMLInputElement>) => void;
	min?: number;
	max?: number;
	step?: number;
	[index: string]: unknown;
};

type State = {
	innerValue: string;
	latestValidValue: number;
}

type Action = {
	type: 'set';
	value: string;
	valueAsNumber: number;
} | {
	type: 'resetLatestSafe';
}

function isValid(val: number, { min, max, step }: { min?: number; max?: number; step?: number }) {
	return (
		!isNaN(val) &&
		(min === undefined || val >= min) &&
		(max === undefined || val <= max) &&
		(step === undefined || isMultiple(val, step))
	);
}

// this is a number input that can temporarily contain invalid values such as '' or '12enoen'
const NumberInput: FunctionComponent<Props> = ({ value, onChange, onBlur, min, max, step, ...props }) => {
	function reducer(state: State, action: Action): State {
		switch (action.type) {
			case 'set': {
				const safeValue = !isValid(action.valueAsNumber, { min, max, step }) ? state.latestValidValue : action.valueAsNumber;
				return {
					...state,
					innerValue: action.value,
					latestValidValue: safeValue,

				};
			}
			case 'resetLatestSafe':
				return {
					...state,
					innerValue: state.latestValidValue.toString(),
				};
			default:
				throw new Error('Invalid action type');
		}
	}
	const [{ innerValue, latestValidValue }, dispatch] = useReducer(reducer, {
		innerValue: value.toString(),
		latestValidValue: value,
	});

	useEffect(() => {
		dispatch({
			type: 'set',
			value: value.toString(),
			valueAsNumber: value,
		});
	}, [value]);

	// state updates are asynchronous
	// so we do our onChange here
	useEffect(() => {
		if (onChange !== undefined && latestValidValue !== value) {
			onChange(latestValidValue);
		}
	}, [latestValidValue]);

	function onInnerChange(ev: ChangeEvent<HTMLInputElement>): void {
		dispatch({
			type: 'set',
			value: ev.target.value,
			valueAsNumber: ev.target.valueAsNumber,
		});
	}

	// put the latest correct value when losing focus
	function onInnerBlur(ev: FocusEvent<HTMLInputElement>): void {
		dispatch({
			type: 'resetLatestSafe',
		});

		if (onBlur !== undefined) {
			onBlur(ev);
		}
	}

	return (
		<input
			{...props}
			min={min}
			max={max}
			step={step}
			type="number"
			value={innerValue}
			onChange={onInnerChange}
			onBlur={onInnerBlur}
		/>
	);
};

export default NumberInput;
