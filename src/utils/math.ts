// https://stackoverflow.com/a/58440614/3489880
export function isMultiple(a: number, b: number): boolean {
	return Math.round(a / b) / (1 / b) === a;
}
