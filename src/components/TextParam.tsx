import React, { FunctionComponent, ChangeEvent, Fragment, useRef } from 'react';
import { observer } from 'mobx-react-lite';
import languages from 'iso-639-1';
import styled from '@emotion/styled';

import { useStore } from 'src/hooks/useStore';
import Text from 'src/models/Text';

const LanguageList = styled.div`
	display: table;
`;
const LanguageRow = styled.div`
	display: table-row;

	* {
		display: table-cell;
	}
`;

const ParamsBox: FunctionComponent<{}> = () => {
	const { editor: { selectedEntity } } = useStore();
	const selectRef = useRef(null);

	if (!Text.is(selectedEntity)) return null;

	function onChangeText(ev: ChangeEvent<HTMLTextAreaElement>, code: string): void {
		if (selectedEntity === undefined) return;
		if (!Text.is(selectedEntity)) {
			throw new Error('Not a text entity');
		}

		selectedEntity.setCopy(code, ev.target.value);
	}

	function onAddLanguage(): void {
		if (selectedEntity === undefined || selectRef.current === null) return;
		if (!Text.is(selectedEntity)) {
			throw new Error('Not a text entity');
		}

		// why is typescript being dumb?
		// eslint-disable-next-line @typescript-eslint/ban-ts-ignore
		// @ts-ignore
		selectedEntity.setCopy(selectRef.current.value, '');
	}

	function onRemoveLanguage(code: string): void {
		if (selectedEntity === undefined || selectRef.current === null) return;
		if (!Text.is(selectedEntity)) {
			throw new Error('Not a text entity');
		}

		selectedEntity.removeLang(code);
	}

	const unusedLanguages = Object.entries(selectedEntity.params.copy)
		.filter(([, copy]) => copy === undefined)
		.map(([code]) => code);

	return (
		<Fragment>
			<LanguageList>
				{Object.entries(selectedEntity.params.copy)
					.filter(([, copy]) => copy !== undefined)
					.map(([code, copy]) => (
						<LanguageRow key={code}>
							<label htmlFor={`text-param-${code}`}>{languages.getNativeName(code)}:</label>
							<textarea
								id={`text-param-${code}`}
								rows={1}
								cols={20}
								wrap="off"
								value={copy}
								onChange={(ev): void => onChangeText(ev, code)}
								minLength={1}
							/>
							{code !== 'en' && (
								<button onClick={(): void => onRemoveLanguage(code)}>Remove</button>
							)}
						</LanguageRow>
					))}
			</LanguageList>
			<div>
				<select ref={selectRef}>
					{unusedLanguages.map((code) => (
						<option key={code} value={code}>{languages.getNativeName(code)}</option>
					))}
				</select>
				<button onClick={onAddLanguage}>Add language</button>
			</div>
		</Fragment>
	);
};

export default observer(ParamsBox);
