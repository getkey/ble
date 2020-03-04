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
const Content = styled.div`
	display: flex;
	flex-direction: column;
`;

type Props = {
	title: string;
};

const Box: FunctionComponent<Props> = ({ children, title }) => {
	return (
		<Container>
			<Title>{title}</Title>
			<Content>
				{children}
			</Content>
		</Container>
	);
};

export default Box;
