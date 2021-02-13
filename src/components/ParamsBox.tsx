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
import FillColorParam from 'src/components/FillColorParam';
import ZOrderParam from 'src/components/ZOrderParam';
import DangerButton from 'src/components/DangerButton';
import VerticesParam from 'src/components/VerticesParam';
import Hoppi from 'src/models/Hoppi';
import Text from 'src/models/Text';
import Entity from 'src/models/Entity';
import VerticesParamsM from 'src/models/VerticesParams';

const ParamsBox: FunctionComponent = () => {
	const { editor: { selection } } = useStore();

	if (selection.size === 0) return null;

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
			{Hoppi.is(selectedEntity) && (
				<HoppiParam hoppi={selectedEntity}/>
			)}
			{('params' in selectedEntity) && ('setAngle' in selectedEntity.params) && ('angle' in selectedEntity.params) && (
				<AngleParam params={selectedEntity.params}/>
			)}
			{('params' in selectedEntity) && ('setRadius' in selectedEntity) && ('radius' in selectedEntity.params) && (
				<RadiusParam radiusEntity={selectedEntity}/>
			)}
			{('params' in selectedEntity) && ('setFillColor' in selectedEntity.params) && ('fillColor' in selectedEntity.params) && (
				<FillColorParam params={selectedEntity.params}/>
			)}
			{Text.is(selectedEntity) && (
				<TextParam text={selectedEntity}/>
			)}
			{('params' in selectedEntity) && ('setIsStatic' in selectedEntity.params) && ('isStatic' in selectedEntity.params) && (
				<StaticParam params={selectedEntity.params}/>
			)}
			{Entity.is(selectedEntity) && (
				<ZOrderParam entity={selectedEntity}/>
			)}
			{('params' in selectedEntity) && VerticesParamsM.is(selectedEntity.params) && (
				<VerticesParam verticesParams={selectedEntity.params}/>
			)}
			<DangerButton onClick={onDelete}>
				<FontAwesomeIcon icon={faTrashAlt}/>
				&#32;
				Delete entity
			</DangerButton>
		</Box>
	);
};

export default observer(ParamsBox);
