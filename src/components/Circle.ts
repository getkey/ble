import { CustomPIXIComponent } from 'react-pixi-fiber';
import { Graphics } from 'pixi.js';
import { getFillColor, getLineColor } from 'src/utils/color';
import { lineWidth } from 'src/config';

type Props = {
	fill: number;
	radius: number;
};

export const behavior = {
	customDisplayObject: (): Graphics => new Graphics(),
	customApplyProps: function(instance: Graphics, oldProps: Props | undefined, newProps: Props): void {
		const { fill: oldFill, radius: oldRadius, ...remainingOldProps } = oldProps ?? {};
		const { fill, radius, ...remainingNewProps } = newProps;

		if (fill !== oldFill || radius !== oldRadius) {
			instance.clear();

			instance.lineStyle(
				lineWidth,
				getLineColor(fill),
				1,
				0
			);

			instance.beginFill(getFillColor(fill));
			instance.drawCircle(0, 0, radius);
			instance.endFill();
		}

		// @ts-expect-error
		this.applyDisplayObjectProps(remainingOldProps, remainingNewProps);
	},
};
export default CustomPIXIComponent(behavior, 'Circle');
