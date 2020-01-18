import React, { FunctionComponent } from 'react';
import { Point } from 'pixi.js';
import { observer, useComputed } from 'mobx-react-lite';

import InteractivePolygon from 'src/components/InteractivePolygon';
import Level from 'src/components/Level';
import { useStore } from 'src/hooks/useStore';
import IPoint from 'src/types/point';

const App: FunctionComponent<{}> = () => {
	const { entities, editor } = useStore();

	const polygonPoints = useComputed(() => (
		entities.map(({ vertices }) => (
			vertices.map(({ x, y }) => new Point(x, y))
		))
	), [entities]);


	function onPolygonPointMove(polygonI: number, pointI: number, pos: IPoint): void {
		const storePoint = entities[polygonI].vertices[pointI];
		const posInWorld = editor.screenToWorld(pos);
		// TODO: add grid snapping to grids of other size than 1
		const roundedPos = {
			x: Math.round(posInWorld.x),
			y: Math.round(posInWorld.y),
		};
		storePoint.set(roundedPos.x, roundedPos.y);
	}

	function onPolygonMove(polygonI: number, delta: IPoint): void {
		const storePolygon = entities[polygonI];
		storePolygon.move(delta.x*(1/editor.scale), delta.y*(1/editor.scale));
	}


	return (
		<Level>
			{polygonPoints.map((points, i) => (
				<InteractivePolygon fill={0xff0000} points={points} key={i} onPointMove={(pointI: number, pos: IPoint): void => onPolygonPointMove(i, pointI, pos)} onMove={(delta: IPoint): void => onPolygonMove(i, delta)}/>
			))}
		</Level>
	);
};
export default observer(App);
