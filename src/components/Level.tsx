import React, { FunctionComponent } from 'react';
import { Container } from 'react-pixi-fiber';
import { observer } from 'mobx-react-lite';

import { useStore } from 'src/hooks/useStore';
import Grid from 'src/components/Grid';

/**
 * This component makes the position of its children relative.
 * It's a sort of camera.
 */
const Level: FunctionComponent = ({ children }) => {
	const { editor } = useStore();

	return (
		<Container
			pivot={editor.position.asPixiPoint}
			scale={editor.scaleAsPixiPoint}
			position={editor.cameraPos}
		>
			<Grid/>
			{children}
		</Container>
	);
};
export default observer(Level);
