import React, { FunctionComponent, Fragment, useState, useEffect, ChangeEvent } from 'react';
import styled from '@emotion/styled';
import { observer } from 'mobx-react-lite';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faDrawPolygon, faPlus } from '@fortawesome/free-solid-svg-icons';

import { useStore } from 'src/hooks/useStore';
import { AddType, blockAddTypes, ballAddTypes, miscAddTypes } from 'src/types/entity';
import { addTypeAliases } from 'src/aliases';

type Props = {
	selected: boolean;
};

const ButtonContainer = styled.fieldset`
	display: flex;
	flex-direction: column;
	border: none;
	padding: none;
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
	margin: 0.5em 0;

	&:first-child {
		margin-top: 0;
	}
	&:last-child {
		margin-bottom: 0;
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
			<span className="fa-layers fa-fw" onClick={toggleDropdown}>
				<FontAwesomeIcon icon={faDrawPolygon} transform="shrink-5 up-2.5 left-2.5"/>
				<FontAwesomeIcon icon={faPlus} transform="shrink-10 right-5 down-5"/>
			</span>
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
