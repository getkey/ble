import React from 'react';
import { settings } from 'pixi.js';
import { render } from 'react-dom';

import Root from 'src/components/Root';

// @ts-ignore
if (/Firefox/i.test(window.navigator.userAgent) && window.navigator.oscpu && /Linux/i.test(window.navigator.oscpu)) {
	// mesa drivers are limited to 16 https://github.com/pixijs/pixi.js/issues/4478
	// unfortunately it's not always mesa on Linux but at least we're sure
	// and for some reason there is no issue on Chrome...
	settings.SPRITE_MAX_TEXTURES = Math.min(settings.SPRITE_MAX_TEXTURES, 16);
}

render(<Root/>,
	document.getElementById('app-container'),
);
