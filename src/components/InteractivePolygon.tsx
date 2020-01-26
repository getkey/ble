import React, { FunctionComponent } from 'react';
import { Container } from 'react-pixi-fiber';
import { Point as PixiPoint, interaction } from 'pixi.js';

import Polygon from 'src/components/Polygon';
import Point from 'src/components/Point';
import grabbable from 'src/utils/grabbable';

const GrabbablePolygon = grabbable(Polygon);
const GrabbablePoint = grabbable(Point);

type Props = {
	fill: number;
	points: Array<PixiPoint>;
	onPolygonPointerDown: (ev: interaction.InteractionEvent) => void;
	onVertexPointerDown: (ev: interaction.InteractionEvent, vertexId: number) => void;
};

const InteractivePolygon: FunctionComponent<Props> = ({ fill, points, onPolygonPointerDown, onVertexPointerDown }) => {
	return (
		<Container>
			<GrabbablePolygon
				fill={fill}
				points={points}
				interactive
				pointerdown={onPolygonPointerDown}
			/>
			{points.map((point_, i) => (
				<GrabbablePoint
					fill={0x0000ff}
					x={point_.x}
					y={point_.y}
					key={i}
					radius={5}
					interactive
					pointerdown={(ev): void => onVertexPointerDown(ev, i)}
				/>
			))}
		</Container>
	);
};

export default InteractivePolygon;
