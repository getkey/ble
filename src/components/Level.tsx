import React, { ReactNode, FunctionComponent } from 'react';
import { Container } from 'react-pixi-fiber';
import { observer } from 'mobx-react-lite';

import { useStore } from 'src/hooks/useStore';

type Props = {
	children: ReactNode,
};

/**
 * This component makes the position of its children relative.
 * It's a sort of camera.
 */
const Level: FunctionComponent<Props> = ({ children }) => {
	const { editor } = useStore();

	return (
		<Container
			pivot={editor.position.asPixiPoint}
			scale={editor.scaleAsPixiPoint}
		>
			{children}
		</Container>
	);
};
export default observer(Level);
