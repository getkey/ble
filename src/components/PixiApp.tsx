import React, { FunctionComponent } from 'react';
import { observer } from 'mobx-react-lite';
import { InteractionEvent } from 'pixi.js';

import ModifiablePolygon from 'src/components/ModifiablePolygon';
import Circle from 'src/components/Circle';
import Level from 'src/components/Level';
import SelectionBox from 'src/components/SelectionBox';
import SelectionAabb from 'src/components/SelectionAabb';
import { useStore } from 'src/hooks/useStore';
import { useDispatch } from 'src/hooks/useDispatch';
import Door from 'src/components/Door';
import Hoppi from 'src/components/Hoppi';
import DoorM from 'src/models/Door';
import BlockM from 'src/models/Block';
import BallM from 'src/models/Ball';
import HoppiM from 'src/models/Hoppi';
import TextM from 'src/models/Text';
import PaintM from 'src/models/Paint';
import ProgressiveText from 'src/components/ProgressiveText';

const entityColors = {
	deadly: 0xff0000, // red
	breakable: 0x8000ff, // purple
	normal: 0xffffff, // white
	ice: 0x00ffff, // cyan
	bouncy: 0xff9900, // orange
};

const PixiApp: FunctionComponent = () => {
	const { level: { entities }, editor: { selection, vertexSelection, selectionBox } } = useStore();
	const dispatch = useDispatch();

	return (
		<Level>
			{entities.map((entity) => {
				const isSelected = selection.get(entity.id) !== undefined;

				if (!isSelected) return;

				const { id, params: { asAabb } } = entity;

				return (
					<SelectionAabb
						key={id}
						aabb={asAabb}
						x={asAabb.pos.x + asAabb.w/2}
						y={asAabb.pos.y + asAabb.h/2}
					/>
				);
			})}
			{entities.map((entity) => {
				if (DoorM.is(entity)) {
					const { id, params: { x, y, angle } } = entity;

					return (
						<Door
							x={x}
							y={y}
							key={id}
							interactive
							pointerdown={(ev): void => dispatch({ type: 'entityPointerDown', entityId: id, ev })}
							rotation={angle}
						/>
					);
				}

				if (BlockM.is(entity)) {
					const { id, type, params: { vertices } } = entity;

					const points = vertices.map((vertex) => ({
						point: vertex.asPixiPoint,
						isSelected: vertexSelection.get(vertex.id) !== undefined,
						id: vertex.id,
					}));

					return (
						<ModifiablePolygon
							isValid={entity.params.isValid}
							fill={entityColors[type]}
							points={points}
							key={id}
							onVertexPointerDown={(ev, vertexId): void => dispatch({ type: 'vertexPointerDown', entityId: id, vertexId, ev })}
							onPolygonPointerDown={(ev): void => dispatch({ type: 'entityPointerDown', entityId: id, ev })}
						/>
					);
				}

				if (BallM.is(entity)) {
					const { id, type, params: { x, y, radius } } = entity;

					return (
						<Circle
							fill={entityColors[type]}
							x={x}
							y={y}
							radius={radius}
							key={id}
							interactive
							pointerdown={(ev: InteractionEvent): void => dispatch({ type: 'entityPointerDown', entityId: id, ev })}
						/>
					);
				}

				if (HoppiM.is(entity)) {
					const { id, params: { x, y, angle } } = entity;

					return (
						<Hoppi
							x={x}
							y={y}
							key={id}
							interactive
							pointerdown={(ev): void => dispatch({ type: 'entityPointerDown', entityId: id, ev })}
							rotation={angle}
						/>
					);
				}
				if (TextM.is(entity)) {
					const { id, params: { x, y, copy, anchor, angle } } = entity;

					return (
						<ProgressiveText
							x={x}
							y={y}
							text={copy.en}
							anchor={anchor}
							key={id}
							interactive
							pointerdown={(ev: InteractionEvent): void => dispatch({ type: 'entityPointerDown', entityId: id, ev })}
							color={0xffffff}
							rotation={angle}
						/>
					);
				}
				if (PaintM.is(entity)) {
					const { id, params: { vertices } } = entity;

					const points = vertices.map((vertex) => ({
						point: vertex.asPixiPoint,
						isSelected: vertexSelection.get(vertex.id) !== undefined,
						id: vertex.id,
					}));

					return (
						<ModifiablePolygon
							isValid={entity.params.isValid}
							fill={entity.params.fillColor}
							points={points}
							key={id}
							onVertexPointerDown={(ev, vertexId): void => dispatch({ type: 'vertexPointerDown', entityId: id, vertexId, ev })}
							onPolygonPointerDown={(ev): void => dispatch({ type: 'entityPointerDown', entityId: id, ev })}
						/>
					);
				}

				// eslint-disable-next-line no-console
				console.error(entity);
				throw new Error('Unknown entity type');
			})}
			{selectionBox && (
				<SelectionBox x={selectionBox.start.x} y={selectionBox.start.y} width={selectionBox.end.x - selectionBox.start.x} height={selectionBox.end.y - selectionBox.start.y}/>
			)}
		</Level>
	);
};
export default observer(PixiApp);
