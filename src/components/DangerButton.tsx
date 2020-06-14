import styled from '@emotion/styled';

import { buttonCss } from 'src/utils/buttons';

export default styled.button`
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
