import React, { FunctionComponent } from 'react';
import { observer } from 'mobx-react-lite';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrashAlt } from '@fortawesome/free-solid-svg-icons';

import { useStore } from 'src/hooks/useStore';
import Box from 'src/components/Box';
import TextParam from 'src/components/TextParam';
import AngleParam from 'src/components/AngleParam';
import StaticParam from 'src/components/StaticParam';
import HoppiParam from 'src/components/HoppiParam';
import RadiusParam from 'src/components/RadiusParam';
import ZOrderParam from 'src/components/ZOrderParam';
import DangerButton from 'src/components/DangerButton';
import LevelParamsBox from 'src/components/LevelParamsBox';

const ParamsBox: FunctionComponent = () => {
	const { editor: { selection } } = useStore();

	if (selection.size === 0){
		return (
			<LevelParamsBox/>
		);
	}

	if (selection.size > 1) {
		return (
			<Box title={`${selection.size} entities selected`}/>
		);
	}

	const selectedEntity = Array.from(selection.values())[0];

	function onDelete(): void {
		selectedEntity.remove();
	}

	return (
		<Box title={selectedEntity.displayName}>
			<HoppiParam/>
			<AngleParam/>
			<RadiusParam/>
			<TextParam/>
			<StaticParam/>
			<ZOrderParam/>
			<DangerButton onClick={onDelete}>
				<FontAwesomeIcon icon={faTrashAlt}/>
				&#32;
				Delete entity
			</DangerButton>
		</Box>
	);
};

export default observer(ParamsBox);
