import { CustomPIXIComponent } from 'react-pixi-fiber';
import { Graphics, Point } from 'pixi.js';

import { selectColor } from 'src/config';

type Props = {
	fill: number;
	points: Array<Point>;
	isSelected: boolean;
};

export const behavior = {
	customDisplayObject: (): Graphics => new Graphics(),
	customApplyProps: function(instance: Graphics, oldProps: Props, newProps: Props): void {
		const { fill: oldFill, points: oldPoints, isSelected: oldIsSelected, ...remainingOldProps } = oldProps;
		const { fill, points, isSelected, ...remainingNewProps } = newProps;

		instance.clear();

		if (isSelected) {
			instance.lineStyle(2, selectColor);
		}
		instance.beginFill(fill);
		instance.drawPolygon(points);
		instance.endFill();

		// @ts-ignore
		this.applyDisplayObjectProps(remainingOldProps, remainingNewProps);
	},
};
export default CustomPIXIComponent(behavior, 'Polygon');
