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

		instance.beginFill(0x0000ff);
		points.forEach((point) => {
			instance.drawCircle(point.x, point.y, 5);
		});
		instance.endFill();
	},
};
export default CustomPIXIComponent(behavior, 'Polygon');
