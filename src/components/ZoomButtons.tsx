import React, { FunctionComponent } from 'react';
import styled from '@emotion/styled';

import { useDispatch } from 'src/hooks/useDispatch';
import ButtonReset from 'src/components/ButtonReset';

const Container = styled.div`
	position: absolute;
	bottom: 16px;
	right: 16px;
	display: flex;
	flex-direction: column;
	background-color: white;
	border-radius: 4px;
`;

const Button = styled(ButtonReset)`
	padding: 2px 4px;
	font-size: 1.2rem;
	font-weight: bold;

`;

const Separator = styled.hr`
	margin: 0 4px;
	color: rgba(0,0,0, 0.5);
`;

const ZoomButtons: FunctionComponent = () => {
	const dispatch = useDispatch();

	return (
		<Container>
			<Button onClick={(): void => dispatch({ type: 'zoom', factor: 1.1 })}>+</Button>
			<Separator/>
			<Button onClick={(): void => dispatch({ type: 'zoom', factor: 0.9 })}>-</Button>
		</Container>
	);
};

export default ZoomButtons;
