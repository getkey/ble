import { CustomPIXIComponent } from 'react-pixi-fiber';
import { Graphics } from 'pixi.js';

import { getLineColor, getStrokeColor } from 'src/utils/color';
import { lineWidth, doorWidth, doorHeight, doorColor } from 'src/config';

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

		instance.lineStyle(
			lineWidth,
			isSelected ? 0xff0000 : getLineColor(doorColor),
			1,
			0,
		);
		instance.beginFill(getStrokeColor(doorColor));

		// frame of the door
		instance.drawRect(0, 0, doorWidth, doorHeight);

		// inside of the door
		instance.lineStyle(lineWidth, doorColor, 1, 1);
		instance.drawPolygon([
			doorWidth, 0,
			doorWidth - 30, 15,
			doorWidth - 30, doorHeight - 15,
			doorWidth, doorHeight,
			doorWidth, 0,
		]);
		instance.endFill();

		// knob
		instance.moveTo(77, 90);
		instance.lineTo(77, 100);

		// eslint-disable-next-line @typescript-eslint/ban-ts-ignore
		// @ts-ignore
		this.applyDisplayObjectProps(remainingOldProps, remainingNewProps);
	},
};
export default CustomPIXIComponent(behavior, 'Door');
