import { CustomPIXIComponent } from 'react-pixi-fiber';
import { Graphics } from 'pixi.js';

type Props = {
	fill: number;
	x: number;
	y: number;
	radius: number;
};

export const behavior = {
	customDisplayObject: (): Graphics => new Graphics(),
	customApplyProps: function(instance: Graphics, oldProps: Props, newProps: Props): void {
		const { fill: oldFill, x: oldX, y: oldY, radius: oldRadius, ...remainingOldProps } = oldProps;
		const { fill, x, y, radius, ...remainingNewProps } = newProps;
		instance.clear();

		instance.beginFill(fill);
		instance.drawCircle(x, y, radius);
		instance.endFill();

		// eslint-disable-next-line @typescript-eslint/ban-ts-ignore
		// @ts-ignore
		this.applyDisplayObjectProps(remainingOldProps, remainingNewProps);
	},
};
export default CustomPIXIComponent(behavior, 'Point');
