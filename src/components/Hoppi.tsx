import { CustomPIXIComponent } from 'react-pixi-fiber';
import { Graphics } from 'pixi.js';
import chroma from 'chroma-js';

import { lineWidth, hoppiColor, darkSlateGray, eyeColor, selectColor } from 'src/config';

type Props = {
	x: number;
	y: number;
	isSelected: boolean;
};

export const behavior = {
	customDisplayObject: (): Graphics => new Graphics(),
	customApplyProps: function(instance: Graphics, oldProps: Props, newProps: Props): void {
		const { isSelected: oldIsSelected, ...remainingOldProps } = oldProps;
		const { isSelected, ...remainingNewProps } = newProps;

		instance.clear();

		// body
		const lineColor = chroma(hoppiColor).brighten(0.5).num();
		instance.lineStyle(lineWidth, isSelected ? selectColor : lineColor, 1, 0);
		const fillColor = chroma.mix(
			chroma(hoppiColor),
			chroma(darkSlateGray),
			0.6,
		).num();
		instance.beginFill(fillColor);

		instance.drawRect(0, 0, 40, 40);


		// face
		const faceLineWidth = 3;
		instance.lineStyle(0);
		instance.beginFill(eyeColor);

		// left eye
		instance.drawRect(15, 10, faceLineWidth, 10);

		// right eye
		instance.drawRect(25, 13, faceLineWidth, 6);

		// mouth
		instance.drawRect(20, 26, faceLineWidth, 3);

		// eslint-disable-next-line @typescript-eslint/ban-ts-ignore
		// @ts-ignore
		this.applyDisplayObjectProps(remainingOldProps, remainingNewProps);
	},
};
export default CustomPIXIComponent(behavior, 'Hoppi');
