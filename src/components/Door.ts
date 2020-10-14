import { CustomPIXIComponent } from 'react-pixi-fiber';
import { Graphics } from 'pixi.js';

import grabbable from 'src/utils/grabbable';
import { getLineColor, getStrokeColor } from 'src/utils/color';
import { lineWidth, doorWidth, doorHeight, doorColor, selectColor } from 'src/config';

type Props = {
	// x and y represent the point in the middle of the door
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

			instance.lineStyle(
				lineWidth,
				isSelected ? selectColor : getLineColor(doorColor),
				1,
				0,
			);
			instance.beginFill(getStrokeColor(doorColor));

			// frame of the door
			instance.drawRect(-doorWidth/2, -doorHeight/2, doorWidth, doorHeight);

			// inside of the door
			instance.lineStyle(lineWidth, doorColor, 1, 1);
			instance.drawPolygon([
				doorWidth/2, -doorHeight/2,
				doorWidth/2 - 30, 15 -doorHeight/2,
				doorWidth/2 - 30, doorHeight/2 - 15,
				doorWidth/2, doorHeight/2,
				doorWidth/2, -doorHeight/2,
			]);
			instance.endFill();

			// knob
			instance.moveTo(77 - doorWidth/2, 90 - doorHeight/2);
			instance.lineTo(77 - doorWidth/2, 100 - doorHeight/2);
		}

		// @ts-ignore
		this.applyDisplayObjectProps(remainingOldProps, remainingNewProps);
	},
};
export default grabbable(CustomPIXIComponent(behavior, 'Door'));
