import { pointSegmentDistanceSquared } from './geom';

test('pointSegmentDistanceSquared', () => {
	expect(pointSegmentDistanceSquared(
		{ x: 0, y: 0},
		{ x: 0, y: 1},
		{ x: 1, y: 1},
	)).toBe(1);

	expect(pointSegmentDistanceSquared(
		{ x: 0, y: 1},
		{ x: 0, y: 0},
		{ x: 1, y: 1},
	)).toBe(1);
});
