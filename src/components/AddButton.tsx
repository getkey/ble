import React, { FunctionComponent, Fragment, useState, useEffect } from 'react';
import { observer } from 'mobx-react-lite';

import Icon from 'src/components/Icon';
import { useStore } from 'src/hooks/useStore';
import { EntityType } from 'src/types/entity';
import plus from 'src/icons/plus.svg';

type Props = {
	selected: boolean;
};

const AddButton: FunctionComponent<Props> = ({ selected }) => {
	const [showDropdown, setShowDropdown] = useState(selected);
	const { editor } = useStore();

	useEffect(() => {
		setShowDropdown(selected);
	}, [selected]);

	function setBlockType(type: EntityType): void {
		setShowDropdown(false);
		editor.setAddType(type);
	}

	function toggleDropdown(): void {
		setShowDropdown(!showDropdown);
	}

	return (
		<Fragment>
			<Icon src={plus} onClick={toggleDropdown}/>
			{showDropdown && (
				<Fragment>
					{Object.values(EntityType).map((type) => (
						<button
							onClick={(): void => setBlockType(type)}
							key={type}
							disabled={type === editor.addType}
						>
							{type}
						</button>
					))}
				</Fragment>
			)}
		</Fragment>
	);
};

export default observer(AddButton);
