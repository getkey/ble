import React, { FunctionComponent } from 'react';
import styled from '@emotion/styled';

const Button = styled.button`
	position: absolute;
	bottom: 0;
	left: 0;
`;

const DomApp: FunctionComponent<{}> = () => {
	function onClick(): void {
		alert('So you wanna save this?');
	}

	return (
		<Button onClick={onClick}>Save</Button>
	);
};

export default DomApp;
