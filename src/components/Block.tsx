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
	points: Array<{
		point: PixiPoint;
		isSelected: boolean;
		id: string;
	}>;
	onPolygonPointerDown: (ev: interaction.InteractionEvent) => void;
	onVertexPointerDown: (ev: interaction.InteractionEvent, vertexId: string) => void;
	isSelected: boolean;
};

const Block: FunctionComponent<Props> = ({ fill, points, onPolygonPointerDown, onVertexPointerDown, isSelected }) => {
	const actualPoints = points.map(({ point }) => point);

	return (
		<Container>
			<GrabbablePolygon
				fill={fill}
				points={actualPoints}
				interactive
				pointerdown={onPolygonPointerDown}
				isSelected={isSelected}
			/>
			{points.map(({ point: point_, isSelected: isSelected_, id }) => (
				<GrabbablePoint
					fill={0x0000ff}
					x={point_.x}
					y={point_.y}
					key={id}
					radius={5}
					interactive
					pointerdown={(ev): void => onVertexPointerDown(ev, id)}
					isSelected={isSelected_}
				/>
			))}
		</Container>
	);
};

export default Block;
