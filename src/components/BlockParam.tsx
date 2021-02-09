import React, { FunctionComponent } from 'react';
import { observer } from 'mobx-react-lite';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrashAlt } from '@fortawesome/free-solid-svg-icons';

import { useStore } from 'src/hooks/useStore';
import { IBlock } from 'src/models/Block';
import DangerButton from 'src/components/DangerButton';

type Props = {
	blockEntity: IBlock,
};

const BlockParam: FunctionComponent<Props> = ({ blockEntity }) => {
	const { editor: { vertexSelection } } = useStore();

	return (
		<div>
			{blockEntity.params.vertices
				.map((vertex, i) => ({ vertex, i }))
				.filter(({ vertex }) => vertexSelection.has(vertex.id))
				.map(({ vertex, i }) => (
					<DangerButton key={vertex.id} onClick={() => vertex.remove()}>
						<FontAwesomeIcon icon={faTrashAlt}/>
						&#32;
						Delete vertex #{i + 1} ({vertex.x},&nbsp;{vertex.y})
					</DangerButton>
				))}
		</div>
	);
};

export default observer(BlockParam);
