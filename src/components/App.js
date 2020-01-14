import React, { useMemo } from 'react';
import { Point } from 'pixi.js';
import { observer } from 'mobx-react-lite';

import Polygon from 'src/components/Polygon.js';
import Level from 'src/components/Level.js';
import { useStore } from 'src/hooks/useStore.js';

function App() {
	const { entities } = useStore();

	const polygonPoints = useMemo(() => (
		entities.map(({ vertices }) => (
			vertices.map(({ x, y }) => new Point(x, y))
		))
	), [entities]);

	return (
		<Level>
			{polygonPoints.map((points, i) => (
				<Polygon fill={0xff0000} points={points} key={i}/>
			))}
		</Level>
	);
}
export default observer(App);
