import React, { FunctionComponent, ChangeEvent } from 'react';
import { observer } from 'mobx-react-lite';

import { useStore } from 'src/hooks/useStore';

const ParamsBox: FunctionComponent<{}> = () => {
	const { editor: { selectedEntity } } = useStore();

	if (selectedEntity === undefined) return null;

	function onToggleStatic(ev: ChangeEvent<HTMLInputElement>): void {
		if (selectedEntity === undefined) return;

		selectedEntity.setIsStatic(ev.target.checked);
	}

	return (
		<div>
			<label>static: <input type="checkbox" checked={selectedEntity.params.isStatic} onChange={onToggleStatic}/></label>
		</div>
	);
};

export default observer(ParamsBox);
