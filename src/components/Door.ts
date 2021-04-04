import { CustomPIXIComponent } from 'react-pixi-fiber';
import { Graphics } from 'pixi.js';

import grabbable from 'src/utils/grabbable';
import { getLineColor, getStrokeColor } from 'src/utils/color';
import { lineWidth, doorWidth, doorHeight, doorColor } from 'src/config';

type Props = {
};

export const behavior = {
	customDisplayObject: (): Graphics => new Graphics(),
	customApplyProps: function(instance: Graphics, oldProps: Props, newProps: Props): void {
		instance.clear();

		instance.lineStyle(
			lineWidth,
			getLineColor(doorColor),
			1,
			0,
		);
		instance.beginFill(getStrokeColor(doorColor));

		// frame of the door
		instance.drawRect(-doorWidth/2, -doorHeight/2, doorWidth, doorHeight);

		// inside of the door
		instance.lineStyle(lineWidth, doorColor, 1, 1);
		instance.drawPolygon([
			doorWidth/2, -doorHeight/2,
			doorWidth/2 - 30, 15 -doorHeight/2,
			doorWidth/2 - 30, doorHeight/2 - 15,
			doorWidth/2, doorHeight/2,
			doorWidth/2, -doorHeight/2,
		]);
		instance.endFill();

		// knob
		instance.moveTo(77 - doorWidth/2, 90 - doorHeight/2);
		instance.lineTo(77 - doorWidth/2, 100 - doorHeight/2);

		// @ts-expect-error
		this.applyDisplayObjectProps(oldProps, newProps);
	},
};
export default grabbable(CustomPIXIComponent(behavior, 'Door'));
