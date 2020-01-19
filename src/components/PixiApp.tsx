import React, { FunctionComponent } from 'react';
import { observer } from 'mobx-react-lite';

import InteractivePolygon from 'src/components/InteractivePolygon';
import Level from 'src/components/Level';
import { useStore } from 'src/hooks/useStore';
import IPoint from 'src/types/point';

const entityColors = {
	deadly: 0xff0000, // red
	breakable: 0x8000ff, // purple
	normal: 0xffffff, // white
	ice: 0x00ffff, // cyan
	bouncy: 0xff9900, // orange
};

const PixiApp: FunctionComponent<{}> = () => {
	const { entities, editor } = useStore();

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
			{entities.map(({ verticesAsPixiPoints, type }, i) => (
				<InteractivePolygon
					fill={entityColors[type]}
					points={verticesAsPixiPoints}
					key={i}
					onPointMove={(pointI: number, pos: IPoint): void => onPolygonPointMove(i, pointI, pos)} onMove={(delta: IPoint): void => onPolygonMove(i, delta)}
				/>
			))}
		</Level>
	);
};
export default observer(PixiApp);
