import { Subject, fromEvent } from 'rxjs';
import { tap, switchMap, takeUntil, map, pairwise, startWith } from 'rxjs/operators';
import React, { useEffect, useState, FunctionComponent } from 'react';
import { Container } from 'react-pixi-fiber';
import { Point as PixiPoint, interaction } from 'pixi.js';

import Polygon from 'src/components/Polygon';
import Point from 'src/components/Point';
import point from 'src/types/point';

type Props = {
	fill: number,
	onPointMove: (i: number, point: point) => void,
	onMove: (delta: point) => void,
	points: Array<PixiPoint>,
};

const InteractivePolygon: FunctionComponent<Props> = ({ fill, points, onPointMove, onMove }) => {
	const [pointerDownVertex$] = useState(new Subject<[interaction.InteractionEvent, number]>());
	const [pointerDownWhole$] = useState(new Subject<interaction.InteractionEvent>());

	useEffect(() => {
		const subs = pointerDownVertex$.pipe(
			switchMap(([, i]) => fromEvent<PointerEvent>(document, 'pointermove').pipe(
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
				// @ts-ignore
				x: data.originalEvent.clientX,
				// @ts-ignore
				y: data.originalEvent.clientY,
			})),
			switchMap(({ x, y }) => fromEvent<PointerEvent>(document, 'pointermove').pipe(
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
			<Polygon fill={fill} points={points} interactive pointerdown={(ev: interaction.InteractionEvent) => pointerDownWhole$.next(ev)}/>
			{points.map((point_, i) => (
				<Point fill={0x0000ff} x={point_.x} y={point_.y} key={i} radius={5} interactive pointerdown={(ev: interaction.InteractionEvent) => pointerDownVertex$.next([ev, i])}/>
			))}
		</Container>
	);
}

export default InteractivePolygon;
