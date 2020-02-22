import React, { FunctionComponent } from 'react';
import styled from '@emotion/styled';
import chroma from 'chroma-js';

import { selectColor } from 'src/config.ts';

const Container = styled.div`
	position: absolute;
	top: 0;
	right: 0;
	background-color: white;

	& > * {
		padding: 8px;
	}
`;
const Title = styled.h2`
	background-color: ${chroma(selectColor).css()};
	margin: 0;
`;

type Props = {
	title: string;
};

const Box: FunctionComponent<Props> = ({ children, title }) => {
	return (
		<Container>
			<Title>{title}</Title>
			<div>
				{children}
			</div>
		</Container>
	);
};

export default Box;
