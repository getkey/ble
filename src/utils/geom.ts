import IPoint from 'src/types/point';
import { Vector } from 'sat';

export function snapToGrid(point: IPoint, cellSize: number): IPoint {
	if (cellSize === 0) return point;

	return {
		x: Math.round(point.x / cellSize) * cellSize,
		y: Math.round(point.y / cellSize) * cellSize,
	};
}

export function pointSegmentDistanceSquared(seg1: IPoint, seg2: IPoint, point: IPoint): number {
	const segment = new Vector(seg1.x - seg2.x, seg1.y - seg2.y);
	const a = new Vector(seg1.x - point.x, seg1.y - point.y);

	const segMagSquared = segment.len2();
	let t = a.dot(segment) / segMagSquared;
	// clamp to turn the line into a segment
	t = Math.min(Math.max(t, 0), 1);

	const projection = segment.scale(t);

	// distance (squared) between projection and a
	// (note that projection gets modified in place but that's fine, we don't need it anymore)
	return projection.sub(a).len2();
}

// https://stackoverflow.com/a/6865965/3489880
export function pointsAligned(point1: IPoint, point2: IPoint, point3: IPoint): boolean {
	return (point3.y - point1.y)  * (point2.x - point1.x) === (point2.y - point1.y) * (point3.x - point1.x);
}
