import { Subject, fromEvent } from 'rxjs';
import { tap, switchMap, takeUntil, map, pairwise, startWith } from 'rxjs/operators';
import React, { useEffect, useState } from 'react';
import { Container } from 'react-pixi-fiber';

import Polygon from 'src/components/Polygon.js';
import Point from 'src/components/Point.js';

export default function InteractivePolygon({ fill, points, onPointMove, onMove }) {
	const [pointerDownVertex$] = useState(new Subject());
	const [pointerDownWhole$] = useState(new Subject());

	useEffect(() => {
		const subs = pointerDownVertex$.pipe(
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

		return () => subs.unsubscribe();
	}, [pointerDownVertex$]);

	useEffect(() => {
		const subs = pointerDownWhole$.pipe(
			// we copy the relevant data because react pools events
			map(({ data }) => ({
				x: data.originalEvent.clientX,
				y: data.originalEvent.clientY,
			})),
			switchMap(({ x, y }) => fromEvent(document, 'pointermove').pipe(
				map(({ clientX, clientY }) => {
					return {
						x: clientX - x,
						y: clientY - y,
					};
				}),
				startWith({ x: 0, y: 0 }),
				pairwise(),
				tap(([previousDelta, currentDelta]) => {
					// compute one increment
					const moveDelta = {
						x: currentDelta.x - previousDelta.x,
						y: currentDelta.y - previousDelta.y,
					};
					onMove(moveDelta);
				}),
				takeUntil(fromEvent(document, 'pointerup')),
			))
		).subscribe();

		return () => subs.unsubscribe();
	}, [pointerDownWhole$]);

	return (
		<Container>
			<Polygon fill={fill} points={points} interactive pointerdown={(ev) => pointerDownWhole$.next(ev)}/>
			{points.map((point, i) => (
				<Point fill={0x0000ff} x={point.x} y={point.y} key={i} radius={5} interactive pointerdown={(ev) => pointerDownVertex$.next([ev, i])}/>
			))}
		</Container>
	);
}
