import React, { FunctionComponent, ChangeEvent } from 'react';
import { observer } from 'mobx-react-lite';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faThumbtack } from '@fortawesome/free-solid-svg-icons';

import { useStore } from 'src/hooks/useStore';

const StaticParam: FunctionComponent = () => {
	const { editor: { selectedEntity } } = useStore();

	if (
		selectedEntity === undefined ||
		!('params' in selectedEntity) ||
		!('setIsStatic' in selectedEntity) ||
		!('isStatic' in selectedEntity.params)
	) return null;

	const onToggleStatic = (ev: ChangeEvent<HTMLInputElement>): void => {
		selectedEntity.setIsStatic(ev.target.checked);
	};

	return (
		<label>
			<FontAwesomeIcon icon={faThumbtack}/>
			&#32;
			static:
			&#32;
			<input type="checkbox" checked={selectedEntity.params.isStatic} onChange={onToggleStatic}/>
		</label>
	);
};

export default observer(StaticParam);
