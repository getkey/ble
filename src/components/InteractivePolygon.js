import { Subject, fromEvent } from 'rxjs';
import { tap, switchMap, takeUntil } from 'rxjs/operators';
import React, { useEffect, useState } from 'react';
import Polygon from 'src/components/Polygon.js';
import Point from 'src/components/Point.js';

export default function InteractivePolygon({ fill, points, onPointMove }) {
	const [pointerDown$] = useState(new Subject());

	useEffect(() => {
		const subs = pointerDown$.pipe(
			switchMap(([, i]) => fromEvent(document, 'pointermove').pipe(
				tap((ev) => {
					onPointMove(i, {
						x: ev.clientX,
						y: ev.clientY,
					});
				}),
				takeUntil(fromEvent(document, 'pointerup')),
			))
		).subscribe();

		// return () => subs.unsubscribe();
	}, [pointerDown$]);

	return (
		<Polygon fill={fill} points={points}>
			{points.map((point, i) => (
				<Point fill={0x0000ff} x={point.x} y={point.y} key={i} radius={5} interactive pointerdown={(ev) => pointerDown$.next([ev, i])}/>
			))}
		</Polygon>
	);
}
