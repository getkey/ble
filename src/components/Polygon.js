import { CustomPIXIComponent } from 'react-pixi-fiber';
import { Graphics } from 'pixi.js';

export const behavior = {
	customDisplayObject: () => new Graphics(),
	customApplyProps: (instance, oldProps, newProps) => {
		const { fill, points } = newProps;
		instance.clear();
		instance.beginFill(fill);
		instance.drawPolygon(points);
		instance.endFill();
	},
};
export default CustomPIXIComponent(behavior, 'Polygon');
