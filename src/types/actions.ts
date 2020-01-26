import { Subject, Observable } from 'rxjs';
import { IRootStore } from 'src/models/';
import { interaction } from 'pixi.js';

export type Actions = {
	type: 'polygonPointerDown';
	polygonId: number;
	ev: interaction.InteractionEvent;
} | {
	type: 'vertexPointerDown';
	polygonId: number;
	vertexId: number;
	ev: interaction.InteractionEvent;
};

export type Epic = (action$: Subject<Actions>, { store }: { store: IRootStore }) => Observable<Actions>
