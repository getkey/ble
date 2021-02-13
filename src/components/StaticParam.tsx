import React, { FunctionComponent, ChangeEvent } from 'react';
import { observer } from 'mobx-react-lite';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faThumbtack } from '@fortawesome/free-solid-svg-icons';

import { IStaticParams } from 'src/models/StaticParams';


type Props = {
	params: IStaticParams,
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
