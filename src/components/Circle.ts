import { CustomPIXIComponent } from 'react-pixi-fiber';
import { Graphics } from 'pixi.js';

import { selectColor } from 'src/config';

type Props = {
	fill: number;
	isSelected: boolean;
	radius: number;
};

export const behavior = {
	customDisplayObject: (): Graphics => new Graphics(),
	customApplyProps: function(instance: Graphics, oldProps: Props, newProps: Props): void {
		const { fill: oldFill, radius: oldRadius, isSelected: oldIsSelected, ...remainingOldProps } = oldProps;
		const { fill, radius, isSelected, ...remainingNewProps } = newProps;

		if (fill !== oldFill || radius !== oldRadius || isSelected !== oldIsSelected) {
			instance.clear();

			if (isSelected) {
				instance.lineStyle(2, selectColor);
			}
			instance.beginFill(fill);
			instance.drawCircle(0, 0, radius);
			instance.endFill();
		}

		// @ts-ignore
		this.applyDisplayObjectProps(remainingOldProps, remainingNewProps);
	},
};
export default CustomPIXIComponent(behavior, 'Circle');
