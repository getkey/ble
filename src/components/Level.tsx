import React, { FunctionComponent, ReactNode } from 'react';
import { Container } from 'react-pixi-fiber';
import { observer } from 'mobx-react-lite';

import { useStore } from 'src/hooks/useStore';
import Grid from 'src/components/Grid';

/**
 * This component makes the position of its children relative.
 * It's a sort of camera.
 */

type Props = {
	children: ReactNode;
}

const Level: FunctionComponent<Props> = ({ children }) => {
	const { editor } = useStore();

	return (
		<Container
			pivot={editor.position.asPixiPoint}
			scale={editor.scaleAsPixiPoint}
			position={editor.cameraPos}
			cursor={editor.globalCursor}
			interactive={true} // for the cursor
		>
			<Grid/>
			{children}
		</Container>
	);
};
export default observer(Level);
