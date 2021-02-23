import { autorun } from 'mobx';
import { Observable } from 'rxjs';

export function fromMobx<T>(mobxObservable: () => T): Observable<T> {
	return new Observable((observer) => {
		autorun(() => observer.next(mobxObservable()));
	});
}
