// https://stackoverflow.com/a/58440614/3489880
export function isMultiple(a: number, b: number): boolean {
	return Math.round(a / b) / (1 / b) === a;
}

export function absMax(...numbers: Array<number>): number {
	if (numbers.length < 1) throw new Error('At least 1 number expected');

	return numbers.reduce((acc, number) => {
		if (Math.abs(number) > Math.abs(acc)) return number;

		return acc;
	}, 0);
}

export function absMin(...numbers: Array<number>): number {
	if (numbers.length < 1) throw new Error('At least 1 number expected');

	return numbers.reduce((acc, number) => {
		if (Math.abs(number) < Math.abs(acc)) return number;

		return acc;
	}, Infinity);
}
