import React, { FunctionComponent, Fragment } from 'react';
import { Container } from 'react-pixi-fiber';
import { Point as PixiPoint, InteractionEvent, Rectangle } from 'pixi.js';
import { observer } from 'mobx-react-lite';

import Polygon from 'src/components/Polygon';
import BlockPolygon from 'src/components/BlockPolygon';
import ProgressiveText from 'src/components/ProgressiveText';
import Point from 'src/components/Point';
import grabbable from 'src/utils/grabbable';
import { useStore } from 'src/hooks/useStore';
import { AddType } from 'src/types/entity';

const GrabbablePoint = grabbable(Point);

const emptyArea = new Rectangle(0, 0, 0, 0);

type Props = {
	fill: number;
	addType?: AddType;
	points: Array<{
		point: PixiPoint;
		isSelected: boolean;
		id: string;
	}>;
	onPolygonPointerDown: (ev: InteractionEvent) => void;
	onVertexPointerDown: (ev: InteractionEvent, vertexId: string) => void;
	isValid: boolean;
	[index: string]: unknown;
};

const ModifiablePolygon: FunctionComponent<Props> = ({ fill, addType, points, onPolygonPointerDown, onVertexPointerDown, isValid, ...props }) => {
	const { editor } = useStore();
	const actualPoints = points.map(({ point }) => point);
	const GrabbablePolygon = (addType === AddType.paint) ? grabbable(Polygon) : grabbable(BlockPolygon);

	return (
		<Container>
			<GrabbablePolygon
				{...props}
				showInvalidTexture={!isValid}
				fill={fill}
				points={actualPoints}
				interactive
				pointerdown={onPolygonPointerDown}
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
						fillColor={0xffffff}
						anchor={{ x: 0.5, y: 0.5 }}
						scale={0.5 / editor.scale}
						interactive={false}
						hitArea={emptyArea}
					/>
				</Fragment>
			))}
		</Container>
	);
};

export default observer(ModifiablePolygon);
