import React from 'react';
import { Stage } from 'react-pixi-fiber';
import Polygon from './Polygon.js';

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
			<Polygon fill={0xff0000} points={points}/>
		</Stage>
	);
}
