import React, { FunctionComponent, ChangeEvent, FocusEvent, PointerEvent, useState } from 'react';

type Props = {
	value: number;
	onChange?: (value: number) => void;
	onBlur?: (ev: FocusEvent<HTMLInputElement>) => void;
	onPointerUp?: (ev: PointerEvent<HashAlgorithmIdentifier>) => void;
	min?: number;
	maxClamp?: number;
	step?: number;
	[index: string]: unknown;
};

// this is a number input that can temporarily contain invalid values such as '' or '12enoen'
const NumberInput: FunctionComponent<Props> = ({ value, onChange, onBlur, onPointerUp, min = 0, step, ...props }) => {
	const maxClamp = Math.max(min, props.maxClamp || 100);
	const [max, setMax] = useState(maxClamp);

	function clampedSetMax(max_: number) {
		setMax(Math.max(max_, maxClamp));
	}

	function onInnerChange(ev: ChangeEvent<HTMLInputElement>) {
		if (onChange) {
			onChange(ev.target.valueAsNumber);
		}
	}

	function onInnerBlur(ev: FocusEvent<HTMLInputElement>) {
		clampedSetMax(ev.target.valueAsNumber * 2);

		if (onBlur) {
			onBlur(ev);
		}
	}

	function onInnerPointerUp(ev: PointerEvent<HTMLInputElement>) {
		// we keep the value for our setTimeout
		const val = (ev.target as HTMLInputElement).valueAsNumber;

		// we wait for the next tick to let onChange happen first
		window.setTimeout(() => {
			clampedSetMax(val * 2);
		}, 0);

		if (onPointerUp) {
			onPointerUp(ev);
		}
	}

	return (
		<input
			{...props}
			type="range"
			value={value}
			min={min}
			max={max}
			onChange={onInnerChange}
			onBlur={onInnerBlur}
			onPointerUpCapture={onInnerPointerUp}
		/>
	);
};

export default NumberInput;
