import { absMax, absMin } from './math';

test('absMax', () => {
	expect(absMax(1, 2, 3)).toBe(3);
	expect(absMax(0)).toBe(0);
	expect(absMax(3)).toBe(3);
	expect(() => absMax()).toThrowError('At least 1 number expected');
	expect(absMax(-13)).toBe(-13);
	expect(absMax(-13, 1)).toBe(-13);
});

test('absMin', () => {
	expect(absMin(1, 2, 3)).toBe(1);
	expect(absMin(0)).toBe(0);
	expect(absMin(3)).toBe(3);
	expect(() => absMin()).toThrowError('At least 1 number expected');
	expect(absMin(-13)).toBe(-13);
	expect(absMin(-13, 1)).toBe(1);
});
