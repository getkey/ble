import { Box, Vector } from 'sat';

import { pointSegmentDistanceSquared, pointsAligned, snapToGrid, snapBoxToGrid } from './geom';

test('pointSegmentDistanceSquared', () => {
	expect(pointSegmentDistanceSquared(
		{ x: 0, y: 0 },
		{ x: 0, y: 1 },
		{ x: 1, y: 1 },
	)).toBe(1);

	expect(pointSegmentDistanceSquared(
		{ x: 0, y: 1 },
		{ x: 0, y: 0 },
		{ x: 1, y: 1 },
	)).toBe(1);
});

test('pointsAligned', () => {
	expect(pointsAligned(
		{ x: 0, y: 0 },
		{ x: 0, y: 0 },
		{ x: 1, y: 1 },
	)).toBe(true);

	expect(pointsAligned(
		{ x: 0, y: 0 },
		{ x: 1, y: 1 },
		{ x: 2, y: 2 },
	)).toBe(true);

	expect(pointsAligned(
		{ x: 0, y: 0 },
		{ x: 1, y: 1 },
		{ x: 1, y: 2 },
	)).toBe(false);
});

describe('snapToGrid', () => {
	test('normal grid', () => {
		expect(snapToGrid({
			x: 20,
			y: 20,
		}, 60)).toEqual({
			x: 0,
			y: 0,
		});
		expect(snapToGrid({
			x: 40,
			y: 40,
		}, 60)).toEqual({
			x: 60,
			y: 60,
		});
		expect(snapToGrid({
			x: -40,
			y: -20,
		}, 60)).toEqual({
			x: -60,
			y: -0,
		});
	});

	test('0 grid', () => {
		expect(snapToGrid({
			x: 20,
			y: 20,
		}, 0)).toEqual({
			x: 20,
			y: 20,
		});
		expect(snapToGrid({
			x: 40,
			y: 40,
		}, 0)).toEqual({
			x: 40,
			y: 40,
		});
	});
});

describe('snapBoxToGrid', () => {
	test('going towards top-left', () => {
		expect(snapBoxToGrid(new Box(new Vector(10, 10), 10, 10), 60)).toEqual({ x: -10, y: -10 });
	});
	test('going towards top-right', () => {
		expect(snapBoxToGrid(new Box(new Vector(10, 40), 10, 10), 60)).toEqual({ x: -10, y: 10 });
	});
	test('going towards bottom-left', () => {
		expect(snapBoxToGrid(new Box(new Vector(40, 10), 10, 10), 60)).toEqual({ x: 10, y: -10 });
	});
	test('going towards top-right', () => {
		expect(snapBoxToGrid(new Box(new Vector(40, 40), 10, 10), 60)).toEqual({ x: 10, y: 10 });
	});
});
