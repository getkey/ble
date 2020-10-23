import IPoint from 'src/types/point';
import { Vector } from 'matter-js';

export function snapToGrid(point: IPoint, cellSize: number): IPoint {
	if (cellSize === 0) return point;

	return {
		x: Math.round(point.x / cellSize) * cellSize,
		y: Math.round(point.y / cellSize) * cellSize,
	};
}

export function pointSegmentDistanceSquared(seg1: IPoint, seg2: IPoint, point: IPoint): number {
	const segment = Vector.create(seg1.x - seg2.x, seg1.y - seg2.y);
	const a = Vector.create(seg1.x - point.x, seg1.y - point.y);

	const segMagSquared = Vector.magnitudeSquared(segment);
	// cast because of https://github.com/DefinitelyTyped/DefinitelyTyped/pull/46168
	let t = Vector.dot(a, segment) / segMagSquared;
	// clamp to turn the line into a segment
	t = Math.min(Math.max(t, 0), 1);

	const projection = Vector.mult(segment, t);

	// distance (squared) between projection and a
	return Vector.magnitudeSquared(Vector.sub(projection, a));
}

export function polygonArea(vertices: Array<IPoint>): number {
	let area = 0;
	for (let i = 0, j = vertices.length - 1; i < vertices.length; j = i++) {
		area += (vertices[i].x + vertices[j].x) * (vertices[j].y - vertices[i].y);
	}
	// area can be negative if the vertices are not ordered counter-clockwise
	return Math.abs(area / 2);
}
