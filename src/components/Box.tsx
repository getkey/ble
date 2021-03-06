import React, { FunctionComponent } from 'react';
import styled from '@emotion/styled';
import { utils } from 'pixi.js';

import { selectColor } from 'src/config';

const Container = styled.div`
	background-color: white;
	max-width: min-content;

	position: absolute;
	top: 100%;
	right: 0;

	& > * {
		padding: 8px;
	}
`;
export const Title = styled.h2`
	background-color: ${utils.hex2string(selectColor)};
	margin: 0;
	/* hide part of title if too big */
	white-space: nowrap;
	overflow: hidden;
	text-overflow: ellipsis;
	max-width: 25ch;
`;
export const Content = styled.div`
	display: flex;
	flex-direction: column;
`;

type Props = {
	title?: string;
};

const Box: FunctionComponent<Props> = ({ children, title }) => {

	if (title === undefined) {
		return (
			<Container>
				{children}
			</Container>
		);
	}

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
