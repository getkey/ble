import React, { FunctionComponent, Fragment } from 'react';
import styled from '@emotion/styled';
import { observer } from 'mobx-react-lite';

import ParamsBox from 'src/components/ParamsBox';
import ZoomButtons from 'src/components/ZoomButtons';
import MenuBar from 'src/components/MenuBar';
import ToolBar from 'src/components/ToolBar';

const TopLeftDiv = styled.div`
	position: absolute;
	top: 0;
	left: 0;
	right: 0;
	display: flex;
	flex-direction: column;
	align-items: flex-start;
`;

const DomApp: FunctionComponent = () => {
	return (
		<Fragment>
			<TopLeftDiv>
				<MenuBar/>
				<ToolBar/>
			</TopLeftDiv>
			<ParamsBox/>
			<ZoomButtons/>
		</Fragment>
	);
};

export default observer(DomApp);
