import React, { FunctionComponent, MouseEvent } from 'react';
import styled from '@emotion/styled';

import { buttonCss } from 'src/utils/buttons';

const Button = styled.button`
	${buttonCss}
	background-color: red;
	border-color: red;
	box-shadow: none;
	color: white;

	&:active {
		background: white;
		color: red;
	}
`;

type Props = {
	onClick?: (ev: MouseEvent) => unknown;
	title?: string;
};

const DangerButton: FunctionComponent<Props> = ({ onClick, ...props }) => {
	function clickHandler(ev: MouseEvent): void {
		if (onClick === undefined) return;

		onClick(ev);
	}

	return (
		<Button {...props} onClick={onClick ? clickHandler : undefined}/>
	);
};

export default DangerButton;
