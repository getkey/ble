import React, { useState, useEffect, FunctionComponent } from 'react';
import { fromEvent } from 'rxjs';
import { tap } from 'rxjs/operators';
import { interaction } from 'pixi.js';

interface IProps {
	pointerdown?: (ev: interaction.InteractionEvent) => void;
}

const grabbable = <P extends object>(
	Component: React.ComponentType<P>
): React.FunctionComponent<P & IProps> => {
	const WrappedComponent: FunctionComponent<P & IProps> = ({
		pointerdown,
		...props
	}: IProps) => {
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
