import { CustomPIXIComponent } from 'react-pixi-fiber';
import { Graphics } from 'pixi.js';

import { selectColor } from 'src/config';

type Props = {
	fill: number;
	isSelected: boolean;
	x: number;
	y: number;
	radius: number;
};

export const behavior = {
	customDisplayObject: (): Graphics => new Graphics(),
	customApplyProps: function(instance: Graphics, oldProps: Props, newProps: Props): void {
		const { fill: oldFill, x: oldX, y: oldY, radius: oldRadius, isSelected: oldIsSelected, ...remainingOldProps } = oldProps;
		const { fill, x, y, radius, isSelected, ...remainingNewProps } = newProps;

		instance.clear();

		if (isSelected) {
			instance.lineStyle(2, selectColor);
		}
		instance.beginFill(fill);
		instance.drawCircle(x, y, radius);
		instance.endFill();

		// @ts-ignore
		this.applyDisplayObjectProps(remainingOldProps, remainingNewProps);
	},
};
export default CustomPIXIComponent(behavior, 'Circle');
