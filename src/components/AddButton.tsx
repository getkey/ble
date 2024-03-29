import React, { FunctionComponent, Fragment, useState, useEffect, ChangeEvent } from 'react';
import styled from '@emotion/styled';
import { observer } from 'mobx-react-lite';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faShapes } from '@fortawesome/free-solid-svg-icons';

import { useStore } from 'src/hooks/useStore';
import { AddType, blockAddTypes, ballAddTypes, miscAddTypes } from 'src/types/entity';
import { addTypeAliases } from 'src/aliases';

type Props = {
	selected: boolean;
};

const ButtonContainer = styled.fieldset`
	display: flex;
	border: none;
	background-color: white;
	position: absolute;
	top: 100%;
`;

const Label = styled.label`
	display: flex;
	color: black;
	white-space: nowrap;
`;

const AddTypeCategory = styled.div`
	margin: 0 0.5em;

	&:first-child {
		margin-left: 0;
	}
	&:last-child {
		margin-right: 0;
	}
`;

const AddButton: FunctionComponent<Props> = ({ selected }) => {
	const [showDropdown, setShowDropdown] = useState(selected);
	const { editor } = useStore();

	useEffect(() => {
		setShowDropdown(selected);
	}, [selected]);

	function setBlockType(ev: ChangeEvent<HTMLInputElement>): void {
		if (!Object.values(AddType).some((allowedType) => allowedType === ev.target.value)) {
			throw new TypeError('Incorrect entity type');
		}
		const addType: AddType = ev.target.value as AddType;

		setShowDropdown(false);
		editor.setAddType(addType);
	}

	function toggleDropdown(): void {
		setShowDropdown(!showDropdown);
	}

	return (
		<Fragment>
			<FontAwesomeIcon icon={faShapes} onClick={toggleDropdown}/>
			{showDropdown && (
				<ButtonContainer>
					{[miscAddTypes, blockAddTypes, ballAddTypes].map((addTypes, i) => (
						<AddTypeCategory key={i}>
							{addTypes.map((type: AddType) => (
								<Label key={type}>
									<input
										type="radio"
										onChange={setBlockType}
										checked={type === editor.addType}
										value={type}
									/>
									{addTypeAliases[type]}
								</Label>
							))}
						</AddTypeCategory>
					))}
				</ButtonContainer>
			)}
		</Fragment>
	);
};

export default observer(AddButton);
