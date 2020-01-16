import { CustomPIXIComponent } from 'react-pixi-fiber';
import { Graphics } from 'pixi.js';

export const behavior = {
	customDisplayObject: () => new Graphics(),
	customApplyProps: function(instance, oldProps, newProps) {
		const { fill: oldFill, x: oldX, y: oldY, radius: oldRadius, ...remainingOldProps } = oldProps;
		const { fill, x, y, radius, ...remainingNewProps } = newProps;
		instance.clear();

		instance.beginFill(fill);
		instance.drawCircle(x, y, radius);
		instance.endFill();

		this.applyDisplayObjectProps(remainingOldProps, remainingNewProps);
	},
};
export default CustomPIXIComponent(behavior, 'Point');
