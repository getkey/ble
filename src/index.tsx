import { Subject } from 'rxjs';
import React from 'react';
import { settings } from 'pixi.js';
import { render } from 'react-dom';

import Root from 'src/components/Root';
import { startEpics } from 'src/utils/epics';
import { store, IRootStore } from 'src/models/';
import epics from 'src/epics/';
import { Actions } from 'src/types/actions';

const action$ = new Subject<Actions>();


startEpics<Actions, { store: IRootStore }>(epics, action$, { store });

if (/Firefox/i.test(window.navigator.userAgent) && /Linux/i.test(window.navigator.oscpu)) {
	// mesa drivers are limited to 16 https://github.com/pixijs/pixi.js/issues/4478
	// unfortunately it's not always mesa on Linux but at least we're sure
	// and for some reason there is no issue on Chrome...
	settings.SPRITE_MAX_TEXTURES = Math.min(settings.SPRITE_MAX_TEXTURES, 16);
}

render(<Root/>,
	document.getElementById('app-container'),
);
