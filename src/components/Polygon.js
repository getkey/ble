import { CustomPIXIComponent } from 'react-pixi-fiber';
import { Graphics } from 'pixi.js';

export const behavior = {
	customDisplayObject: () => new Graphics(),
	customApplyProps: function(instance, oldProps, newProps) {
		const { fill: oldFill, points: oldPoints, ...remainingOldProps } = oldProps;
		const { fill, points, ...remainingNewProps } = newProps;

		instance.clear();

		instance.beginFill(fill);
		instance.drawPolygon(points);
		instance.endFill();

		this.applyDisplayObjectProps(remainingOldProps, remainingNewProps);
	},
};
export default CustomPIXIComponent(behavior, 'Polygon');
