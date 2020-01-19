import React, { FunctionComponent } from 'react';
import styled from '@emotion/styled';
import { getSnapshot } from 'mobx-state-tree';
import { observer } from 'mobx-react-lite';

import { useStore } from 'src/hooks/useStore';
import { download } from 'src/utils/download';

const Button = styled.button`
	position: absolute;
	bottom: 0;
	left: 0;
`;

const DomApp: FunctionComponent<{}> = () => {
	const { level } = useStore();

	function onClick(): void {
		const snapshot = JSON.stringify(getSnapshot(level), null, '\t');
		download(snapshot, 'level.json', 'application/json');
	}

	return (
		<Button onClick={onClick}>Save</Button>
	);
};

export default observer(DomApp);
