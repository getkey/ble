import React, { FunctionComponent, ChangeEvent } from 'react';
import { observer } from 'mobx-react-lite';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faThumbtack } from '@fortawesome/free-solid-svg-icons';

interface StaticEntity {
	params: {
		isStatic: boolean;
	}
	setIsStatic: (isStatic: boolean) => void;
}

type Props = {
	staticEntity: StaticEntity,
};

const StaticParam: FunctionComponent<Props> = ({ staticEntity }) => {
	const onToggleStatic = (ev: ChangeEvent<HTMLInputElement>): void => {
		staticEntity.setIsStatic(ev.target.checked);
	};

	return (
		<label>
			<FontAwesomeIcon icon={faThumbtack}/>
			&#32;
			static:
			&#32;
			<input type="checkbox" checked={staticEntity.params.isStatic} onChange={onToggleStatic}/>
		</label>
	);
};

export default observer(StaticParam);
