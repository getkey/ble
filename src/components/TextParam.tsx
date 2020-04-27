import React, { FunctionComponent, ChangeEvent } from 'react';
import { observer } from 'mobx-react-lite';

import { useStore } from 'src/hooks/useStore';
import Text from 'src/models/Text';


const ParamsBox: FunctionComponent<{}> = () => {
	const { editor: { selectedEntity } } = useStore();

	if (!Text.is(selectedEntity)) return null;

	function onChangeText(ev: ChangeEvent<HTMLTextAreaElement>): void {
		if (selectedEntity === undefined) return;
		if (!Text.is(selectedEntity)) {
			throw new Error('Not a text entity');
		}

		selectedEntity.setCopy('en', ev.target.value);
	}

	return (
		<div>
			en: <textarea rows={1} wrap="off" value={selectedEntity.params.copy.en} onChange={onChangeText}/>
		</div>
	);
};

export default observer(ParamsBox);
