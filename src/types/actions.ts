import { Subject, Observable } from 'rxjs';
import { IRootStore } from 'src/models/';
import IPoint from 'src/types/point';
import { interaction } from 'pixi.js';

export type Actions = {
	type: 'entityPointerDown';
	entityId: string;
	ev: interaction.InteractionEvent;
} | {
	type: 'vertexPointerDown';
	entityId: string;
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
} | {
	type: 'deleteEntity';
	entityId: string;
};
