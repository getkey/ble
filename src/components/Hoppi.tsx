import { CustomPIXIComponent } from 'react-pixi-fiber';
import { Graphics, utils } from 'pixi.js';
import { lab } from 'd3-color';
import { interpolateLab } from 'd3-interpolate';

import { lineWidth, hoppiColor, darkSlateGray, eyeColor, selectColor, hoppiSize } from 'src/config';
import grabbable from 'src/utils/grabbable';

type Props = {
	// x and y represent the point in the middle of the Hoppi
	x: number;
	y: number;
	isSelected: boolean;
};

export const behavior = {
	customDisplayObject: (): Graphics => new Graphics(),
	customApplyProps: function(instance: Graphics, oldProps: Props, newProps: Props): void {
		const { isSelected: oldIsSelected, ...remainingOldProps } = oldProps;
		const { isSelected, ...remainingNewProps } = newProps;

		if (isSelected !== oldIsSelected) {
			instance.clear();

			// body
			const lineColor = utils.string2hex(
				lab(utils.hex2string(hoppiColor))
					.brighter(0.1)
					.formatHex(),
			);
			instance.lineStyle(lineWidth, isSelected ? selectColor : lineColor, 1, 0);
			const fillColor = utils.string2hex(
				lab(
					interpolateLab(
						utils.hex2string(hoppiColor),
						utils.hex2string(darkSlateGray),
					)(0.55),
				).formatHex(),
			);
			instance.beginFill(fillColor);

			instance.drawRect(-20, -20, hoppiSize, hoppiSize);

			// face
			const faceLineWidth = 3;
			instance.lineStyle(0);
			instance.beginFill(eyeColor);

			// left eye
			instance.drawRect(-5, -10, faceLineWidth, 10);

			// right eye
			instance.drawRect(5, -7, faceLineWidth, 6);

			// mouth
			instance.drawRect(0, 6, faceLineWidth, 3);
		}

		// @ts-ignore
		this.applyDisplayObjectProps(remainingOldProps, remainingNewProps);
	},
};
export default grabbable(CustomPIXIComponent(behavior, 'Hoppi'));
