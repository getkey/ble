import React, { FunctionComponent, Fragment, ChangeEvent } from 'react';
import styled from '@emotion/styled';
import { observer } from 'mobx-react-lite';

import { useStore } from 'src/hooks/useStore';
import { EditorMode } from 'src/types/editor';
import bin from 'src/icons/bin.svg';
import cursor from 'src/icons/cursor.svg';
import plus from 'src/icons/plus.svg';

const RadioGroup = styled.fieldset`
	display: flex;
	list-style-type: none;
	position: absolute;
	top: 0;
	left: 0;
	border: none;
	background-color: white;
	margin: 0;
	padding: 4px;
`;

const Label = styled.label`
	opacity: 0.1;
	cursor: pointer;
`;

const RadioButton = styled.input`
	display: none;
	&:checked + label {
		opacity: 1;
	}
`;

const Icon = styled.img`
	width: 32px;
	height: 32px;
`;

const icons = {
	'delete': bin,
	'select': cursor,
	'add': plus,
};

const ModeBar: FunctionComponent<{}> = () => {
	const { editor } = useStore();

	function onChange(ev: ChangeEvent<HTMLInputElement>): void {
		if (!Object.values(EditorMode).some((allowedMode) => allowedMode === ev.target.value)) {
			throw new TypeError('Incorrect editor mode');
		}
		const newMode: EditorMode = EditorMode[ev.target.value as keyof typeof EditorMode];
		editor.setMode(newMode);
	}

	return (
		<RadioGroup>
			{Object.values(EditorMode).map((availableMode: EditorMode) => (
				<Fragment key={availableMode}>
					<RadioButton
						id={`editor-mode-${availableMode}`}
						type="radio"
						name="editor-mode"
						key={availableMode}
						value={availableMode}
						checked={availableMode === editor.mode}
						onChange={onChange}
					/>
					<Label htmlFor={`editor-mode-${availableMode}`} title={availableMode}>
						<Icon src={icons[availableMode]}/>
					</Label>
				</Fragment>
			))}
		</RadioGroup>
	);
};

export default observer(ModeBar);
