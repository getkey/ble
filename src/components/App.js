import React, { useMemo } from 'react';
import { Stage } from 'react-pixi-fiber';
import { Point } from 'pixi.js';
import { observer } from 'mobx-react-lite';

import Polygon from 'src/components/Polygon.js';
import Level from 'src/components/Level.js';
import { useStore } from 'src/hooks/useStore.js';

function App() {
	const store = useStore();

	const polygonPoints = useMemo(() => (
		store.entities.map(({ vertices }) => (
			vertices.map(({ x, y }) => new Point(x, y))
		)
		)
	), [store]);

	return (
		<Stage options={{
			backgroundColor: 0x121f1f,
			resizeTo: document.body,
		}}>
			<Level>
				{polygonPoints.map((points, i) => (
					<Polygon fill={0xff0000} points={points} key={i}/>
				))}
			</Level>
		</Stage>
	);
}
export default observer(App);
