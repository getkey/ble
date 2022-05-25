import { EMPTY } from 'rxjs';
import { ajax } from 'rxjs/ajax';
import { ignoreElements, pluck, tap } from 'rxjs/operators';
import { Epic } from 'epix';
import { applySnapshot } from 'mobx-state-tree';
import { getBounds } from 'bombhopperio-level-tools';

export const loadLevelFromQueryParam: Epic = (action$, { store }) => {
	const urlParams = new URLSearchParams(window.location.search);
	const levelId = urlParams.get('levelId');

	if (levelId && window.confirm('The saved level will be overwritten. Are you sure?')) {
		return ajax(`https://assets.bombhopper.io/levels/${levelId}.json`).pipe(
			pluck('response'),
			tap((level) => {
				// eslint-disable-next-line @typescript-eslint/no-explicit-any
				const { top, right, bottom, left } = getBounds((level as any).entities);
				const middle = {
					x: left + (right - left) / 2,
					y: top + (bottom - top) / 2,
				};
				applySnapshot(store.level, level);
				store.editor.position.set(middle.x, middle.y);
			}),
			ignoreElements(),
		);
	}

	return EMPTY;
};
