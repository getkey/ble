import React, { FunctionComponent, ComponentType } from 'react';

// can't use an arrow function here, it breaks TSX
// see https://stackoverflow.com/a/54614279
const grabbable = function<P>(
	Component: ComponentType<P>
): FunctionComponent<P> {
	const WrappedComponent: FunctionComponent<P> = ({ ...props }) => {
		return (
			<Component
				{...props}
				interactive
				cursor="move"
			/>
		);
	};
	WrappedComponent.displayName = `grabbable(${Component.displayName || Component.name || 'Component'})`;

	return WrappedComponent;
};

export default grabbable;
