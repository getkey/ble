import React, { FunctionComponent, ChangeEvent } from 'react';
import { utils } from 'pixi.js';
import styled from '@emotion/styled';
import { observer } from 'mobx-react-lite';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPalette } from '@fortawesome/free-solid-svg-icons';

import { useStore } from 'src/hooks/useStore';

const Container = styled.div`
	display: flex;
	flex-direction: column;
`;

interface ColorParams {
	fillColor: number;
	setFillColor: (fillColor: number) => void;
}

type Props = {
	params: ColorParams,
};

const AngleParam: FunctionComponent<Props> = ({ params }) => {
	const { undoManager } = useStore();

	const onInput = (ev: ChangeEvent<HTMLInputElement>): void => {
		params.setFillColor(utils.string2hex(ev.target.value));
	};

	function onFocus(): void {
		undoManager.startGroup();
	}
	function onBlur(): void {
		undoManager.stopGroup();
	}

	return (
		<Container>
			<label>
				<FontAwesomeIcon icon={faPalette}/>
				&#32;
				fill color:
				&#32;
				<input
					type="color"
					value={utils.hex2string(params.fillColor)}
					onInput={onInput}
					onFocus={onFocus}
					onBlur={onBlur}
				/>
			</label>
		</Container>
	);
};

export default observer(AngleParam);
