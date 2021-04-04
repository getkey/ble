import { CustomPIXIComponent } from 'react-pixi-fiber';
import { Graphics } from 'pixi.js';
import { selectColor, lineWidth } from 'src/config';

type Props = {
	fill: number;
	stroke: number;
	radius: number;
	strokeWidth: number;
	isSelected: boolean;
};

export const behavior = {
	customDisplayObject: (): Graphics => new Graphics(),
	customApplyProps: function(instance: Graphics, oldProps: Props, newProps: Props): void {
		const { fill: oldFill, stroke: oldStroke, radius: oldRadius, strokeWidth: oldStrokeWidth, isSelected: oldIsSelected, ...remainingOldProps } = oldProps;
		const { fill, stroke, radius, strokeWidth, isSelected, ...remainingNewProps } = newProps;


		if (fill !== oldFill || stroke !== oldStroke || radius !== radius || strokeWidth !== oldStrokeWidth || isSelected !== oldIsSelected) {
			instance.clear();
			if (isSelected) {
				instance.lineStyle(lineWidth, selectColor);
			} else {
				instance.lineStyle(strokeWidth, stroke);
			}

			instance.beginFill(fill);
			instance.drawCircle(0, 0, radius);
			instance.endFill();
		}

		// @ts-expect-error
		this.applyDisplayObjectProps(remainingOldProps, remainingNewProps);
	},
};
export default CustomPIXIComponent(behavior, 'Point');
