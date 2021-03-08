import React, { FunctionComponent, Fragment } from 'react';
import styled from '@emotion/styled';
import { observer } from 'mobx-react-lite';
import { ToastContainer, Zoom } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import ParamsBox from 'src/components/ParamsBox';
import ZoomButtons from 'src/components/ZoomButtons';
import MenuBar from 'src/components/MenuBar';
import ToolBar from 'src/components/ToolBar';

const TopStuff = styled.div`
	position: relative;
	display: flex;
	flex-direction: column;
	align-items: flex-start;
`;

const DomApp: FunctionComponent = () => {
	return (
		<Fragment>
			<TopStuff>
				<MenuBar/>
				<ToolBar/>
				<ParamsBox/>
			</TopStuff>
			<ZoomButtons/>
			<ToastContainer
				position="bottom-left"
				transition={Zoom} // less distracting
			/>
		</Fragment>
	);
};

export default observer(DomApp);
