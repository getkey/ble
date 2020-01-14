import React from 'react';
import { Container } from 'react-pixi-fiber';
import { observer } from 'mobx-react-lite';

import { useStore } from '../hooks/useStore.js';

/**
 * This component makes the position of its children relative.
 * It's a sort of camera.
 */
function Level({ children }) {
	const store = useStore();

	return (
		<Container pivot={{ x: store.editor.position.x, y: store.editor.position.y }}>
			{children}
		</Container>
	);
}
export default observer(Level);
