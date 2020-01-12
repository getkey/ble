import React from 'react';
import { render } from 'react-dom';
import { Sprite, Stage } from 'react-pixi-fiber';
import Polygon from './components/Polygon.js';

const points = [
	0, 0,
	0, 50,
	50, 50,
	50, 0,
];
render(
	<Stage options={{ backgroundColor: 0x121f1f, height: 600, width: 800 }}>
		<Polygon fill={0xff0000} points={points}/>
	</Stage>,
	document.getElementById('app-container'),
);
