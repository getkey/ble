import React from 'react';
import { Container } from 'react-pixi-fiber';
import { observer } from 'mobx-react-lite';

import { useStore } from 'src/hooks/useStore.js';

/**
 * This component makes the position of its children relative.
 * It's a sort of camera.
 */
function Level({ children }) {
	const { editor } = useStore();

	return (
		<Container
			pivot={{ x: editor.position.x, y: editor.position.y }}
			scale={{ x: editor.scale, y: editor.scale }}
		>
			{children}
		</Container>
	);
}
export default observer(Level);
