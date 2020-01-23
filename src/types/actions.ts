import { Subject, Observable } from 'rxjs';
import { IRootStore } from 'src/models/';

export type Actions = { type: 'lol'; yo: number } | { type: 'kek'; lel: string }

export type Epic = (action$: Subject<Actions>, { store }: { store: IRootStore }) => Observable<Actions>
