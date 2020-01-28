import React, { FunctionComponent } from 'react';
import { observer } from 'mobx-react-lite';

import InteractivePolygon from 'src/components/InteractivePolygon';
import Level from 'src/components/Level';
import { useStore } from 'src/hooks/useStore';
import { useDispatch } from 'src/hooks/useDispatch';

const entityColors = {
	deadly: 0xff0000, // red
	breakable: 0x8000ff, // purple
	normal: 0xffffff, // white
	ice: 0x00ffff, // cyan
	bouncy: 0xff9900, // orange
};

const PixiApp: FunctionComponent<{}> = () => {
	const { level: { entities } } = useStore();
	const dispatch = useDispatch();

	return (
		<Level>
			{entities.map(({ verticesAsPixiPoints, type, id }) => (
				<InteractivePolygon
					fill={entityColors[type]}
					points={verticesAsPixiPoints}
					key={id}
					onVertexPointerDown={(ev, vertexId): void => dispatch({ type: 'vertexPointerDown', polygonId: id, vertexId, ev })}
					onPolygonPointerDown={(ev): void => dispatch({ type: 'polygonPointerDown', polygonId: id, ev })}
				/>
			))}
		</Level>
	);
};
export default observer(PixiApp);
