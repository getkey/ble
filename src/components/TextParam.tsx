import React, { FunctionComponent, ChangeEvent, Fragment, useRef } from 'react';
import { observer } from 'mobx-react-lite';
import languages from 'iso-639-1';
import styled from '@emotion/styled';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrashAlt, faLanguage, faAlignLeft } from '@fortawesome/free-solid-svg-icons';

import { useStore } from 'src/hooks/useStore';
import DangerButton from 'src/components/DangerButton';
import { ITextParams, Align } from 'src/models/TextParams';

const LanguageList = styled.div`
	display: table;
`;
const LanguageRow = styled.div`
	display: table-row;

	* {
		display: table-cell;
		vertical-align: middle;
	}
`;

const LangLabel = styled.label`
	text-align: right;
`;

type Props = {
	params: ITextParams;
}

const ParamsBox: FunctionComponent<Props> = ({ params }) => {
	const selectRef = useRef(null);
	const { undoManager } = useStore();

	const onChangeText = (ev: ChangeEvent<HTMLTextAreaElement>, code: string): void => {
		params.setCopy(code, ev.target.value);
	};

	function onTextFocus(): void {
		undoManager.startGroup();
	}
	function onTextBlur(): void {
		undoManager.stopGroup();
	}

	const onAddLanguage = (): void => {
		if (selectRef.current === null) return;

		// why is typescript being dumb?
		// @ts-expect-error
		params.setCopy(selectRef.current.value, '');
	};

	const onRemoveLanguage = (code: string): void => {
		if (selectRef.current === null) return;

		params.removeLang(code);
	};

	const unusedLanguages = Object.entries(params.copy)
		.filter(([, copy]) => copy === undefined)
		.map(([code]) => code);

	const onChangeAlign = (ev: ChangeEvent<HTMLSelectElement>): void => {
		params.setAlign(ev.target.value as Align);
	};

	return (
		<Fragment>
			<LanguageList>
				{Object.entries(params.copy)
					.filter(([, copy]) => copy !== undefined)
					.map(([code, copy]) => (
						<LanguageRow key={code}>
							<div>
								<LangLabel htmlFor={`text-param-${code}`}>{languages.getNativeName(code)}:</LangLabel>
								{code !== 'en' && (
									<DangerButton
										onClick={(): void => onRemoveLanguage(code)}
										title="Remove language"
									>
										<FontAwesomeIcon icon={faTrashAlt}/>
									</DangerButton>
								)}
							</div>
							<textarea
								id={`text-param-${code}`}
								rows={3}
								cols={40}
								wrap="off"
								value={copy}
								onChange={(ev): void => onChangeText(ev, code)}
								onFocus={onTextFocus}
								onBlur={onTextBlur}
								minLength={1}
							/>
						</LanguageRow>
					))}
			</LanguageList>
			<div>
				<select ref={selectRef} defaultValue="es">
					{unusedLanguages.map((code) => (
						<option key={code} value={code}>{languages.getNativeName(code)}</option>
					))}
				</select>
				<button onClick={onAddLanguage}>
					<FontAwesomeIcon icon={faLanguage}/>
					&#32;
					Add language
				</button>
			</div>
			<label>
				<FontAwesomeIcon icon={faAlignLeft}/>
				&#32;
				align:
				&#32;
				<select value={params.align} onChange={onChangeAlign}>
					{Object.values(Align).map((align) => (
						<option key={align} value={align}>{align}</option>
					))}
				</select>
			</label>
		</Fragment>
	);
};

export default observer(ParamsBox);
