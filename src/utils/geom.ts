import IPoint from 'src/types/point';

export function snapToGrid(point: IPoint, cellSize: number): IPoint {
	if (cellSize === 0) return point;

	return {
		x: Math.round(point.x / cellSize) * cellSize,
		y: Math.round(point.y / cellSize) * cellSize,
	};
}

// Checks if two line segments intersects.
// It's LENIENT: the points at the end of segments are allowed to intersect with segments and other points
// modified from https://github.com/schteppe/poly-decomp.js/blob/4eebc5b5780d8ffd8094615622b701e34a7835e8/src/index.js#L46 under the MIT by Stefan Hedman
// which itself probably comes from https://stackoverflow.com/questions/563198/how-do-you-detect-where-two-line-segments-intersect
function lineSegmentsIntersect(p1: IPoint, p2: IPoint, q1: IPoint, q2: IPoint): boolean {
	const dx = p2.x - p1.x;
	const dy = p2.y - p1.y;
	const da = q2.x - q1.x;
	const db = q2.y - q1.y;

	// segments are parallel
	if ((da * dy - db * dx) === 0) {
		return false;
	}

	const s = (dx * (q1.y - p1.y) + dy * (p1.x - q1.x)) / (da * dy - db * dx);
	const t = (da * (p1.y - q1.y) + db * (q1.x - p1.x)) / (db * dx - da * dy);

	return s > 0 && s < 1 && t > 0 && t < 1;
}

export function polygonIsSimple(polygon: Array<IPoint>): boolean {
	const path = [
		...polygon,
		polygon[0], // close the path so the segment between the first and the last point will be checked
	];

	return path.slice(0, -1).every((pointA, i) => {
		const pointB = path[i + 1];

		return path.slice(0, i - 1).every((pointC, j) => {
			const pointD = path[j + 1];

			return !lineSegmentsIntersect(pointA, pointB, pointC, pointD);
		});

		return true;
	});
}
