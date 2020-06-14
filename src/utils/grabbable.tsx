import React, { useState, useEffect, FunctionComponent, ComponentType } from 'react';
import { fromEvent } from 'rxjs';
import { tap } from 'rxjs/operators';
import { interaction } from 'pixi.js';

type IProps = {
	pointerdown?: (ev: interaction.InteractionEvent) => void;
};

// can't use an arrow function here, it breaks TSX
// see https://stackoverflow.com/a/54614279
const grabbable = function<P>(
	Component: ComponentType<P>
): FunctionComponent<P & IProps> {
	const WrappedComponent: FunctionComponent<P> = ({
		pointerdown,
		...props
	}: P & IProps) => {
		const [grabbing, setGrabbing] = useState(false);

		useEffect(() => {
			const subs = fromEvent(document, 'pointerup').pipe(
				tap(() => {
					setGrabbing(false);
				}),
			).subscribe();

			return (): void => subs.unsubscribe();
		}, []);

		function onPointerDown(ev: interaction.InteractionEvent): void {
			setGrabbing(true);
			if (pointerdown !== undefined) {
				pointerdown(ev);
			}
		}

		return (
			<Component
				{...props as P}
				interactive
				cursor={grabbing ? 'grabbing' : 'grab'}
				pointerdown={onPointerDown}
			/>
		);
	};
	WrappedComponent.displayName = `grabbable(${Component.displayName || Component.name || 'Component'})`;

	return WrappedComponent;
};

export default grabbable;
