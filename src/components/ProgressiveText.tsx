import { observer } from 'mobx-react-lite';
import React, { FunctionComponent } from 'react';
import { BitmapText, Text } from 'react-pixi-fiber';

import { useStore } from 'src/hooks/useStore';
import { fontSize } from 'src/config';

type Props = {
	color: number;
	[index: string]: unknown;
};

const ProgressiveText: FunctionComponent<Props> = ({ color, ...props }) => {
	const { editor: { fontLoaded } } = useStore();

	if (!fontLoaded) {
		return (
			<Text
				{...props}
				style={{
					fontFamily: ['Courier New', 'Courier', 'monospace', 'sans-serif'],
					fontWeight: '300',
					fontSize: fontSize * 1.5,
					fill: color,
					align: 'center',
				}}
			/>
		);
	}

	return (
		<BitmapText
			{...props}
			font={`${fontSize} Press Start 2P`}
			tint={color}
		/>
	);
};
export default observer(ProgressiveText);
