import React, { FunctionComponent, Fragment, useState, useEffect, ChangeEvent } from 'react';
import styled from '@emotion/styled';
import { observer } from 'mobx-react-lite';

import Icon from 'src/components/Icon';
import { useStore } from 'src/hooks/useStore';
import { EntityType } from 'src/types/entity';
import addBlock from 'src/icons/add_block.svg'; // not to be confused with adblock :P
import { entityAliases } from 'src/aliases';

type Props = {
	selected: boolean;
};

const ButtonContainer = styled.fieldset`
	display: flex;
	flex-direction: column;
	border: none;
	padding: none;
	background-color: transparant;
	position: absolute;
	top: 100%;
`;

const Label = styled.label`
	display: flex;
`;

const AddButton: FunctionComponent<Props> = ({ selected }) => {
	const [showDropdown, setShowDropdown] = useState(selected);
	const { editor } = useStore();

	useEffect(() => {
		setShowDropdown(selected);
	}, [selected]);

	function setBlockType(ev: ChangeEvent<HTMLInputElement>): void {
		if (!Object.values(EntityType).some((allowedType) => allowedType === ev.target.value)) {
			throw new TypeError('Incorrect entity type');
		}
		const addType: EntityType = ev.target.value as EntityType;

		setShowDropdown(false);
		editor.setAddType(addType);
	}

	function toggleDropdown(): void {
		setShowDropdown(!showDropdown);
	}

	return (
		<Fragment>
			<Icon src={addBlock} onClick={toggleDropdown}/>
			{showDropdown && (
				<ButtonContainer>
					{Object.values(EntityType).map((type) => (
						<Label key={type}>
							<input
								type="radio"
								onChange={setBlockType}
								checked={type === editor.addType}
								value={type}
							/>
							{entityAliases[type]}
						</Label>
					))}
				</ButtonContainer>
			)}
		</Fragment>
	);
};

export default observer(AddButton);
