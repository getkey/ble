import React, { FunctionComponent } from 'react';
import { observer } from 'mobx-react-lite';
import styled from '@emotion/styled';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSoap } from '@fortawesome/free-solid-svg-icons';

import { useStore } from 'src/hooks/useStore';
import { buttonCss } from 'src/utils/buttons';

const Button = styled.button`
	${buttonCss}
`;

const ClearButton: FunctionComponent = () => {
	const { level } = useStore();

	function onClear(): void {
		level.clearEntities();
	}

	return (
		<Button onClick={onClear}>
			<FontAwesomeIcon icon={faSoap}/>
			&#32;
			Clear
		</Button>
	);
};

export default observer(ClearButton);
