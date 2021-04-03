import { CustomPIXIComponent } from 'react-pixi-fiber';
import { Graphics } from 'pixi.js';
import { Box } from 'sat';

import { selectColor } from 'src/config';

type Props = {
	fill: number;
	isSelected: boolean;
	radius: number;
	aabb: Box;
};

export const behavior = {
	customDisplayObject: (): Graphics => new Graphics(),
	customApplyProps: function(instance: Graphics, oldProps: Props, newProps: Props): void {
		const { fill: oldFill, radius: oldRadius, isSelected: oldIsSelected, aabb: oldAabb, ...remainingOldProps } = oldProps;
		const { fill, radius, isSelected, aabb, ...remainingNewProps } = newProps;

		if (fill !== oldFill || radius !== oldRadius || isSelected !== oldIsSelected || aabb !== oldAabb) {
			instance.clear();

			instance.beginFill(fill);
			instance.drawCircle(0, 0, radius);
			instance.endFill();

			if (isSelected) {
				instance.lineStyle(2, selectColor);
				instance.beginFill(0xffffff, 0);
				instance.drawRect(-aabb.w/2, -aabb.h/2, aabb.w, aabb.h);
			}
		}

		// @ts-ignore
		this.applyDisplayObjectProps(remainingOldProps, remainingNewProps);
	},
};
export default CustomPIXIComponent(behavior, 'Circle');
