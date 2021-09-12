import { Subject } from 'rxjs';
import React, { FunctionComponent, Fragment, useEffect } from 'react';
import { Stage } from 'react-pixi-fiber';
import { startEpics } from 'epix';
import { Application } from 'pixi.js';

import PixiApp from 'src/components/PixiApp';
import DomApp from 'src/components/DomApp';
import { StoreProvider } from 'src/hooks/useStore';
import { DispatchProvider } from 'src/hooks/useDispatch';
import { IRootStore } from 'src/models/RootStore';
import { store } from 'src/models/';
import epics from 'src/epics/';
import { Actions } from 'src/types/actions';
import app from 'src/app';

export const action$ = new Subject<Actions>();
startEpics<Actions, { store: IRootStore; app: Application }>(epics, action$, { store, app });

const Root: FunctionComponent = () => {
	useEffect(() => {
		// after the first render, resize the pixi canvas to the remaining available size
		// (by default the canvas is dimensionned to the whole viewport)
		app.resize();
	}, []);
	// WARNING:
	// StoreProvider has to be inside Stage or the context gets all fucked up.
	// Check out the React devtool, it looks like react-pixi-fiber is doing some magic
	// that moves back the Stage to a second React root level,
	// whereas the normal root level has almost nothing in it.
	// (I suppose it would be okay to have another StoreProvider around Stage, too)
	return (
		<Fragment>
			<Stage app={app}>
				<DispatchProvider value={action$}>
					<StoreProvider value={store}>
						<PixiApp/>
					</StoreProvider>
				</DispatchProvider>
			</Stage>
			<DispatchProvider value={action$}>
				<StoreProvider value={store}>
					<DomApp/>
				</StoreProvider>
			</DispatchProvider>
		</Fragment>
	);
};

export default Root;
