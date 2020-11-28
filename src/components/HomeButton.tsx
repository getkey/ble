import React, { FunctionComponent } from 'react';
import styled from '@emotion/styled';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHome } from '@fortawesome/free-solid-svg-icons';
import { inIframe, postMessage } from 'src/utils/iframe';

import { buttonCss } from 'src/utils/buttons';

const Button = styled.button`
	${buttonCss}
`;

const HomeButton: FunctionComponent = () => {
	function onClick(): void {
		postMessage({
			type: 'home',
		});
	}

	if (!inIframe) return null;

	return (
		<Button onClick={onClick}>
			<FontAwesomeIcon icon={faHome}/>
			&#32;
			Home
		</Button>
	);
};

export default HomeButton;
