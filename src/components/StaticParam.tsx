import React, { FunctionComponent, ChangeEvent } from 'react';
import { observer } from 'mobx-react-lite';

import { useStore } from 'src/hooks/useStore';
import Door from 'src/models/Door';
import Block from 'src/models/Block';
import Hoppi from 'src/models/Hoppi';

const StaticParam: FunctionComponent<{}> = () => {
	const { editor: { selectedEntity } } = useStore();

	if (selectedEntity === undefined || !(Door.is(selectedEntity) || Block.is(selectedEntity) || Hoppi.is(selectedEntity))) return null;

	function onToggleStatic(ev: ChangeEvent<HTMLInputElement>): void {
		if (selectedEntity === undefined) return;
		if (!(Door.is(selectedEntity) || Block.is(selectedEntity) || Hoppi.is(selectedEntity))) throw new Error('Doesn\'t have isStatic');

		selectedEntity.setIsStatic(ev.target.checked);
	}

	return (
		<label>static: <input type="checkbox" checked={selectedEntity.params.isStatic} onChange={onToggleStatic}/></label>
	);
};

export default observer(StaticParam);
