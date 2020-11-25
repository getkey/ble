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
	confirmationMessage?: string;
	title?: string;
};

const DangerButton: FunctionComponent<Props> = ({ onClick, confirmationMessage = 'Are you sure?', ...props }) => {
	function clickHandler(ev: MouseEvent): void {
		if (onClick === undefined || !window.confirm(confirmationMessage)) return;

		onClick(ev);
	}

	return (
		<Button {...props} onClick={onClick ? clickHandler : undefined}/>
	);
};

export default DangerButton;
