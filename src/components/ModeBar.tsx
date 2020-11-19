import React, { FunctionComponent, Fragment, ChangeEvent } from 'react';
import styled from '@emotion/styled';
import { observer } from 'mobx-react-lite';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faDrawPolygon, faMousePointer } from '@fortawesome/free-solid-svg-icons';
import chroma from 'chroma-js';

import { useStore } from 'src/hooks/useStore';
import { EditorMode } from 'src/types/editor';
import AddButton from 'src/components/AddButton';
import { buttonCss, primaryButtonCss } from 'src/utils/buttons';
import { darkSlateGray } from 'src/config';

const RadioGroup = styled.div`
	display: inline-flex;
	list-style-type: none;
	border: none;
	margin: 0;
	padding: 0;
	align-items: center;
`;

const Label = styled.label`
	${buttonCss}
	cursor: pointer;
	display: flex;
	align-items: center;
	color: ${chroma(darkSlateGray).hex()};

	color: black;
	svg {
		font-size: 1.5em;
	}
`;

const RadioButton = styled.input`
	display: none;
	&:checked + label {
		${primaryButtonCss}
	}
`;

const SelectButton: FunctionComponent = () => (
	<FontAwesomeIcon icon={faMousePointer} fixedWidth />
);
const AddVertexButton: FunctionComponent = () => (
	<FontAwesomeIcon icon={faDrawPolygon}/>
);

const icons = {
	[EditorMode.select]: SelectButton,
	[EditorMode.addBlock]: AddButton,
	[EditorMode.addVertex]: AddVertexButton,
};

const ModeBar: FunctionComponent = () => {
	const { editor } = useStore();

	function onChange(ev: ChangeEvent<HTMLInputElement>): void {
		if (!editor.availableModes.some((allowedMode: EditorMode) => allowedMode === ev.target.value)) {
			throw new TypeError('Incorrect editor mode');
		}
		const newMode: EditorMode = EditorMode[ev.target.value as keyof typeof EditorMode];
		editor.setMode(newMode);
	}

	return (
		<RadioGroup>
			{editor.availableModes.map((availableMode: EditorMode) => {
				const selected = availableMode === editor.mode;
				const Component = icons[availableMode];
				return (
					<Fragment key={availableMode}>
						<RadioButton
							id={`editor-mode-${availableMode}`}
							type="radio"
							name="editor-mode"
							key={availableMode}
							value={availableMode}
							checked={selected}
							onChange={onChange}
						/>
						<Label
							htmlFor={`editor-mode-${availableMode}`}
							title={availableMode}
						>
							<Component selected={selected}/>
						</Label>
					</Fragment>
				);
			})}
		</RadioGroup>
	);
};

export default observer(ModeBar);
