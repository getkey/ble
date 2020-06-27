import React, { FunctionComponent } from 'react';
import { observer } from 'mobx-react-lite';

import { useStore } from 'src/hooks/useStore';
import Box from 'src/components/Box';
import TextParam from 'src/components/TextParam';
import AngleParam from 'src/components/AngleParam';
import StaticParam from 'src/components/StaticParam';
import HoppiParam from 'src/components/HoppiParam';
import ZOrderParam from 'src/components/ZOrderParam';
import DangerButton from 'src/components/DangerButton';
import LevelParamsBox from 'src/components/LevelParamsBox';

const ParamsBox: FunctionComponent = () => {
	const { editor: { selectedEntity } } = useStore();

	if (selectedEntity === undefined){
		return (
			<LevelParamsBox/>
		);
	}

	function onDelete(): void {
		if (selectedEntity === undefined) return;

		selectedEntity.remove();
	}

	return (
		<Box title={selectedEntity.displayName}>
			<HoppiParam/>
			<StaticParam/>
			<AngleParam/>
			<TextParam/>
			<ZOrderParam/>
			<DangerButton onClick={onDelete}>Delete entity</DangerButton>
		</Box>
	);
};

export default observer(ParamsBox);
