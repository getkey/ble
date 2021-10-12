import React, { FunctionComponent, ChangeEvent } from 'react';
import { observer } from 'mobx-react-lite';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faReply } from '@fortawesome/free-solid-svg-icons';

import { ITextureMirroringParams } from 'src/models/TextureMirroringParams';


type Props = {
	params: ITextureMirroringParams,
};

const TextureMirroringParam: FunctionComponent<Props> = ({ params }) => {
	const onToggleFacing = (ev: ChangeEvent<HTMLInputElement>): void => {
		params.setRightFacing(ev.target.checked);
	};

	return (
		<label>
			<FontAwesomeIcon icon={faReply}/>
			&#32;
			flip horizontally:
			&#32;
			<input type="checkbox" checked={params.rightFacing} onChange={onToggleFacing}/>
		</label>
	);
};

export default observer(TextureMirroringParam);
