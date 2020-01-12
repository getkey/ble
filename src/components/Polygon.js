import { CustomPIXIComponent } from 'react-pixi-fiber';
import * as PIXI from 'pixi.js';

export const behavior = {
	customDisplayObject: props => new PIXI.Graphics(),
	customApplyProps: function(instance, oldProps, newProps) {
		const { fill, points } = newProps;
		instance.clear();
		instance.beginFill(fill);
		instance.drawPolygon(points);
		instance.endFill();
	}
};
export default CustomPIXIComponent(behavior, 'Polygon');
