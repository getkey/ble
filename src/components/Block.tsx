import React, { FunctionComponent, Fragment } from 'react';
import { Container } from 'react-pixi-fiber';
import { Point as PixiPoint, InteractionEvent, Rectangle } from 'pixi.js';
import { observer } from 'mobx-react-lite';

import Polygon from 'src/components/Polygon';
import ProgressiveText from 'src/components/ProgressiveText';
import Point from 'src/components/Point';
import grabbable from 'src/utils/grabbable';
import { useStore } from 'src/hooks/useStore';

const GrabbablePolygon = grabbable(Polygon);
const GrabbablePoint = grabbable(Point);

const emptyArea = new Rectangle(0, 0, 0, 0);

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
			{points.map(({ point: point_, isSelected: isSelected_, id }, i) => (
				<Fragment key={id}>
					<GrabbablePoint
						fill={0x0000ff}
						stroke={0xffffff}
						position={point_}
						radius={7}
						strokeWidth={1}
						scale={1 / editor.scale}
						interactive
						pointerdown={(ev): void => onVertexPointerDown(ev, id)}
						isSelected={isSelected_}
					/>
					<ProgressiveText
						text={i + 1}
						position={point_}
						color={0xffffff}
						anchor={{ x: 0.5, y: 0.5 }}
						scale={0.5}
						interactive={false}
						hitArea={emptyArea}
					/>
				</Fragment>
			))}
		</Container>
	);
};

export default observer(Block);
