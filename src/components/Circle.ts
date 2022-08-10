import { CustomPIXIComponent } from 'react-pixi-fiber';
import { Graphics } from 'pixi.js';

type Props = {
	fill: number;
	radius: number;
};

export const behavior = {
	customDisplayObject: (): Graphics => new Graphics(),
	customApplyProps: function(instance: Graphics, oldProps: Props | undefined, newProps: Props): void {
		const { fill: oldFill, radius: oldRadius, ...remainingOldProps } = oldProps || {};
		const { fill, radius, ...remainingNewProps } = newProps;

		if (fill !== oldFill || radius !== oldRadius) {
			instance.clear();

			instance.beginFill(fill);
			instance.drawCircle(0, 0, radius);
			instance.endFill();
		}

		// @ts-expect-error
		this.applyDisplayObjectProps(remainingOldProps, remainingNewProps);
	},
};
export default CustomPIXIComponent(behavior, 'Circle');
