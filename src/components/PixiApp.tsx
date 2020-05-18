import React, { FunctionComponent } from 'react';
import { observer } from 'mobx-react-lite';
import { interaction } from 'pixi.js';

import InteractivePolygon from 'src/components/InteractivePolygon';
import Level from 'src/components/Level';
import { useStore } from 'src/hooks/useStore';
import { useDispatch } from 'src/hooks/useDispatch';
import Door from 'src/components/Door';
import Hoppi from 'src/components/Hoppi';
import DoorM from 'src/models/Door';
import BlockM from 'src/models/Block';
import HoppiM from 'src/models/Hoppi';
import TextM from 'src/models/Text';
import { selectColor } from 'src/config';
import ProgressiveText from 'src/components/ProgressiveText';

const entityColors = {
	deadly: 0xff0000, // red
	breakable: 0x8000ff, // purple
	normal: 0xffffff, // white
	ice: 0x00ffff, // cyan
	bouncy: 0xff9900, // orange
};

const PixiApp: FunctionComponent<{}> = () => {
	const { level: { entities }, editor: { selectedEntity } } = useStore();
	const dispatch = useDispatch();

	return (
		<Level>
			{entities.map((entity) => {
				const isSelected = entity === selectedEntity;

				if (DoorM.is(entity)) {
					const { id, params: { x, y, angle } } = entity;

					return (
						<Door
							x={x}
							y={y}
							key={id}
							isSelected={isSelected}
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
						isSelected: vertex === selectedEntity,
					}));

					return (
						<InteractivePolygon
							fill={entityColors[type]}
							points={points}
							key={id}
							onVertexPointerDown={(ev, vertexId): void => dispatch({ type: 'vertexPointerDown', entityId: id, vertexId, ev })}
							onPolygonPointerDown={(ev): void => dispatch({ type: 'entityPointerDown', entityId: id, ev })}
							isSelected={isSelected}
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
							isSelected={isSelected}
							interactive
							pointerdown={(ev): void => dispatch({ type: 'entityPointerDown', entityId: id, ev })}
							rotation={angle}
						/>
					);
				}
				if (TextM.is(entity)) {
					const { id, params: { x, y, copy, anchor} } = entity;

					return (
						<ProgressiveText
							x={x}
							y={y}
							text={copy.en}
							anchor={anchor}
							key={id}
							interactive
							pointerdown={(ev: interaction.InteractionEvent): void => dispatch({ type: 'entityPointerDown', entityId: id, ev })}
							color={isSelected ? selectColor : 0xffffff}
						/>
					);
				}

				// eslint-disable-next-line no-console
				console.error(entity);
				throw new Error('Unknown entity type');
			})}
		</Level>
	);
};
export default observer(PixiApp);
