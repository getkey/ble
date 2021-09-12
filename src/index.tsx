import React from 'react';
import { settings } from 'pixi.js';
import { render } from 'react-dom';
import { init as sentryInit, ErrorBoundary} from '@sentry/react';
import { Integrations } from '@sentry/tracing';

import 'src/global.css';
import Root, { action$ } from 'src/components/Root';

if (/Firefox/i.test(window.navigator.userAgent) && /Linux/i.test(window.navigator.userAgent)) {
	// mesa drivers are limited to 16 https://github.com/pixijs/pixi.js/issues/4478
	// unfortunately it's not always mesa on Linux but at least we're sure
	// and for some reason there is no issue on Chrome...
	settings.SPRITE_MAX_TEXTURES = Math.min(settings.SPRITE_MAX_TEXTURES, 16);
}

function onHydrate() {
	action$.next({
		type: 'hydrate',
	});
}

if (process.env.SENTRY_DSN) {
	sentryInit({
		dsn: process.env.SENTRY_DSN,
		integrations: [
			new Integrations.BrowserTracing(),
		],
		tracesSampleRate: 0.5,
	});

	render(
		<ErrorBoundary showDialog>
			<Root/>
		</ErrorBoundary>,
		document.getElementById('app-container'),
		onHydrate,
	);
} else {
	render(
		<Root/>,
		document.getElementById('app-container'),
		onHydrate,
	);
}
