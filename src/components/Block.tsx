import React, { FunctionComponent } from 'react';
import { Container } from 'react-pixi-fiber';
import { Point as PixiPoint, InteractionEvent } from 'pixi.js';
import { observer } from 'mobx-react-lite';

import Polygon from 'src/components/Polygon';
import Point from 'src/components/Point';
import grabbable from 'src/utils/grabbable';
import { useStore } from 'src/hooks/useStore';

const GrabbablePolygon = grabbable(Polygon);
const GrabbablePoint = grabbable(Point);

type Props = {
	fill: number;
	points: Array<{
		point: PixiPoint;
		isSelected: boolean;
		id: string;
	}>;
	onPolygonPointerDown: (ev: InteractionEvent) => void;
	onVertexPointerDown: (ev: InteractionEvent, vertexId: string) => void;
	isSelected: boolean;
	isSimple: boolean;
};

const Block: FunctionComponent<Props> = ({ fill, points, onPolygonPointerDown, onVertexPointerDown, isSelected, isSimple }) => {
	const { editor } = useStore();
	const actualPoints = points.map(({ point }) => point);

	return (
		<Container>
			<GrabbablePolygon
				showInvalidTexture={!isSimple}
				fill={fill}
				points={actualPoints}
				interactive
				pointerdown={onPolygonPointerDown}
				isSelected={isSelected}
			/>
			{points.map(({ point: point_, isSelected: isSelected_, id }) => (
				<GrabbablePoint
					fill={0x0000ff}
					stroke={0xffffff}
					position={point_}
					key={id}
					radius={7}
					strokeWidth={1}
					scale={1 / editor.scale}
					interactive
					pointerdown={(ev): void => onVertexPointerDown(ev, id)}
					isSelected={isSelected_}
				/>
			))}
		</Container>
	);
};

export default observer(Block);
