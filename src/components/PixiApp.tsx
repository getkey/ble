import React, { FunctionComponent } from 'react';
import { observer } from 'mobx-react-lite';

import InteractivePolygon from 'src/components/InteractivePolygon';
import Level from 'src/components/Level';
import { useStore } from 'src/hooks/useStore';
import { useDispatch } from 'src/hooks/useDispatch';
import Door from 'src/components/Door';
import DoorM from 'src/models/Door';
import EntityM from 'src/models/Entity';

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
			{Array.from(entities.values()).map((entity) => {
				if (DoorM.is(entity)) {
					const { id, params: { x, y} } = entity;

					return (
						<Door
							x={x}
							y={y}
							key={id}
							isSelected={entity === selectedEntity}
							interactive
							pointerdown={(ev): void => dispatch({ type: 'polygonPointerDown', polygonId: id, ev })}
						/>
					);
				}

				if (EntityM.is(entity)) {
					const { verticesAsPixiPoints, id, type } = entity;
					return (
						<InteractivePolygon
							fill={entityColors[type]}
							points={verticesAsPixiPoints}
							key={id}
							onVertexPointerDown={(ev, vertexId): void => dispatch({ type: 'vertexPointerDown', polygonId: id, vertexId, ev })}
							onPolygonPointerDown={(ev): void => dispatch({ type: 'polygonPointerDown', polygonId: id, ev })}
							isSelected={entity === selectedEntity}
						/>
					);
				}

				return null;
			})}
		</Level>
	);
};
export default observer(PixiApp);
