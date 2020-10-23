import { pointSegmentDistanceSquared, polygonArea } from './geom';

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

test('polygonArea', () => {
	// all points
	expect(polygonArea([
		{ x: -5, y: 0 },
		{ x: -2, y: 0 },
		{ x: 1, y: 0 },
	])).toBe(0);

	expect(polygonArea([
		{ x: 0, y: -2 },
		{ x: 0, y: 4 },
		{ x: 0, y: -5 },
	])).toBe(0);

	expect(polygonArea([
		{ x: -1, y: 1 },
		{ x: 1, y: 1 },
		{ x: 1, y: -1 },
		{ x: -1, y: -1 },
	])).toBe(4);


	// a little bit more complex shape
	expect(polygonArea([
		{ x: 0, y: 0 },
		{ x: 4, y: 3 },
		{ x: 4, y: 0 },
		{ x: 0, y: 0 },
		{ x: 2, y: 0 },
		{ x: 2, y: 0.5 },
	])).toBeCloseTo(5.5);


	// test regular polygons with `n` vertices
	const radius = 100;
	for (let n = 3; n <= 12; ++n) {
		// expected area of the regular polygon
		const area = n * Math.sin(2 * Math.PI / n) * radius * radius / 2;

		// construct vertices array for the regular polygon
		const vertices = [];
		for (let i = 0; i < n; ++i) {
			// all vertices lay on the circumcircle of the polygon
			vertices.push({
				x: Math.cos(2 * Math.PI * i / n) * radius,
				y: -Math.sin(2 * Math.PI * i / n) * radius,
			});
		}
		// use `toBeCloseTo` to compare the float values
		expect(polygonArea(vertices)).toBeCloseTo(area, 6);
	}
});
