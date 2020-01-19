import React, { FunctionComponent, Fragment } from 'react';
import { Stage } from 'react-pixi-fiber';

import PixiApp from 'src/components/PixiApp';
import DomApp from 'src/components/DomApp';
import { StoreProvider } from 'src/hooks/useStore';
import { store } from 'src/models/';

const Root: FunctionComponent<{}> = () => {
	// WARNING:
	// StoreProvider has to be inside Stage or the context gets all fucked up.
	// Check out the React devtool, it looks like react-pixi-fiber is doing some magic
	// that moves back the Stage to a second React root level,
	// whereas the normal root level has almost nothing in it.
	// (I suppose it would be okay to have another StoreProvider around Stage, too)
	return (
		<Fragment>
			<Stage options={{
				backgroundColor: 0x121f1f,
				resizeTo: document.body,
			}}>
				<StoreProvider value={store}>
					<PixiApp/>
				</StoreProvider>
			</Stage>
			<StoreProvider value={store}>
				<DomApp/>
			</StoreProvider>
		</Fragment>
	);
};

export default Root;
