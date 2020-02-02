import { Subject, Observable } from 'rxjs';
import { IRootStore } from 'src/models/';
import IPoint from 'src/types/point';
import { interaction } from 'pixi.js';

export type Actions = {
	type: 'polygonPointerDown';
	polygonId: string;
	ev: interaction.InteractionEvent;
} | {
	type: 'vertexPointerDown';
	polygonId: string;
	vertexId: number;
	ev: interaction.InteractionEvent;
} | {
	type: 'addVertex';
	pos: IPoint;
} | {
	type: 'addEntity';
	pos: IPoint;
} | {
	type: 'backgroundClick';
};

export type Epic = (action$: Subject<Actions>, { store }: { store: IRootStore }) => Observable<Actions>
