import { observer } from 'mobx-react-lite';
import React, { FunctionComponent } from 'react';
import { BitmapText, Text } from 'react-pixi-fiber';

import { useStore } from 'src/hooks/useStore';
import { fontSize } from 'src/config';
import grabbable from 'src/utils/grabbable';

type Props = {
	fillColor: number;
	[index: string]: unknown;
};

const ProgressiveText: FunctionComponent<Props> = ({ fillColor, ...props }) => {
	const { editor: { fontLoaded } } = useStore();

	if (!fontLoaded) {
		return (
			<Text
				{...props}
				style={{
					fontFamily: ['Courier New', 'Courier', 'monospace', 'sans-serif'],
					fontWeight: '300',
					fontSize: fontSize * 1.5,
					fill: fillColor,
					align: 'center',
				}}
			/>
		);
	}

	return (
		<BitmapText
			{...props}
			style={{
				fontName: 'Press Start 2P',
			}}
			fontName="Press Start 2P"
			fontSize={fontSize}
			tint={fillColor}
		/>
	);
};
export default grabbable<Props>(observer(ProgressiveText));
