import React, { FunctionComponent, ChangeEvent } from 'react';
import { observer } from 'mobx-react-lite';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faThumbtack } from '@fortawesome/free-solid-svg-icons';

interface StaticParams {
	isStatic: boolean;
	setIsStatic: (isStatic: boolean) => void;
}

type Props = {
	params: StaticParams,
};

const StaticParam: FunctionComponent<Props> = ({ params }) => {
	const onToggleStatic = (ev: ChangeEvent<HTMLInputElement>): void => {
		params.setIsStatic(ev.target.checked);
	};

	return (
		<label>
			<FontAwesomeIcon icon={faThumbtack}/>
			&#32;
			static:
			&#32;
			<input type="checkbox" checked={params.isStatic} onChange={onToggleStatic}/>
		</label>
	);
};

export default observer(StaticParam);
