import { fromEvent } from 'rxjs';
import { map, tap, ignoreElements } from 'rxjs/operators';

import { Epic, ofType } from 'epix';

export const wheelZoom: Epic = () => {
	return fromEvent<WheelEvent>(document, 'wheel').pipe(
		// read https://github.com/facebook/react/pull/505#issuecomment-31300604 before touching this line
		map((ev: WheelEvent) => 1 + -0.1*Math.sign(ev.deltaY)),
		map((factor) => ({
			type: 'zoom',
			factor,
		})),
	);
};

export const zoom: Epic = (action$, { store }) => {
	return action$.pipe(
		ofType('zoom'),
		tap(({ factor }) => {
			const scale = store.editor.scale;
			store.editor.setScale(scale * factor);
		}),
		ignoreElements(),
	);
};
