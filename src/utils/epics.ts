import { merge, Subscription, Observable, Subject } from 'rxjs';
import { tap, filter } from 'rxjs/operators';

// eslint-disable-next-line @typescript-eslint/interface-name-prefix
export interface ActionLike {
	type: string;
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	[index: string]: any;
}

export function startEpics<A extends ActionLike, P>(
	epics: Array<(action$: Subject<A>, params: P) => Observable<A>>,
	action$: Subject<A>,
	params: P,
): Subscription {
	const subscription = merge(
		...epics.map((epic) => epic(action$, params).pipe(
			tap((action: A) => {
				if (action.type === undefined) {
					// eslint-disable-next-line no-console
					console.error(action, 'is not an action and was returned from', epic);
					throw new TypeError('Not an action. Maybe you need to ignoreElements() in your epic.');
				}
			}),
		)),
	).pipe(
		tap((action) => {
			action$.next(action);
		}),
	).subscribe();

	return subscription;
}



export function ofType(...keys: Array<string>) {
	return (source: Observable<ActionLike>): Observable<ActionLike> => source.pipe(
		filter(({ type }) => keys.some((key) => key === type)),
	);
}
