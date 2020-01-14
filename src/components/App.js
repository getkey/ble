import React from 'react';
import { Stage } from 'react-pixi-fiber';

import Polygon from 'src/components/Polygon.js';
import Level from 'src/components/Level.js';

const points = [
	0, 0,
	0, 50,
	50, 50,
	50, 0,
];

export default function App() {
	return (
		<Stage options={{
			backgroundColor: 0x121f1f,
			resizeTo: document.body,
		}}>
			<Level>
				<Polygon fill={0xff0000} points={points}/>
			</Level>
		</Stage>
	);
}
