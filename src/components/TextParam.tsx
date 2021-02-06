import React, { FunctionComponent, ChangeEvent, Fragment, useRef } from 'react';
import { observer } from 'mobx-react-lite';
import languages from 'iso-639-1';
import styled from '@emotion/styled';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrashAlt, faLanguage } from '@fortawesome/free-solid-svg-icons';

import { useStore } from 'src/hooks/useStore';
import { IText } from 'src/models/Text';
import DangerButton from 'src/components/DangerButton';

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
	text: IText;
}

const ParamsBox: FunctionComponent<Props> = ({ text }) => {
	const selectRef = useRef(null);
	const { undoManager } = useStore();

	const onChangeText = (ev: ChangeEvent<HTMLTextAreaElement>, code: string): void => {
		text.setCopy(code, ev.target.value);
	};

	function onTextFocus(): void {
		// eslint-disable-next-line @typescript-eslint/no-empty-function
		undoManager.startGroup(() => {});
	}
	function onTextBlur(): void {
		undoManager.stopGroup();
	}

	const onAddLanguage = (): void => {
		if (selectRef.current === null) return;

		// why is typescript being dumb?
		// @ts-ignore
		text.setCopy(selectRef.current.value, '');
	};

	const onRemoveLanguage = (code: string): void => {
		if (selectRef.current === null) return;

		text.removeLang(code);
	};

	const unusedLanguages = Object.entries(text.params.copy)
		.filter(([, copy]) => copy === undefined)
		.map(([code]) => code);

	return (
		<Fragment>
			<LanguageList>
				{Object.entries(text.params.copy)
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
				<select ref={selectRef}>
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
		</Fragment>
	);
};

export default observer(ParamsBox);
