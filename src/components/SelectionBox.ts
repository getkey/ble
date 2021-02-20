import { CustomPIXIComponent } from 'react-pixi-fiber';
import { Graphics } from 'pixi.js';

import { selectColor } from 'src/config';

type Props = {
	x: number;
	y: number;
	width: number;
	height: number;
};

export const behavior = {
	customDisplayObject: (): Graphics => new Graphics(),
	customApplyProps: function(instance: Graphics, oldProps: Props, newProps: Props): void {
		const { x: oldX, y: oldY, width: oldWidth, height: oldHeight, ...remainingOldProps } = oldProps;
		const { x, y, width, height, ...remainingNewProps } = newProps;

		if (x !== oldX || y !== oldY || width !== oldWidth || height !== oldHeight) {
			instance.clear();

			instance.lineStyle(1, selectColor);
			instance.beginFill(selectColor, 0.2);
			instance.drawRect(x, y, width, height);
			instance.endFill();
		}

		// @ts-ignore
		this.applyDisplayObjectProps(remainingOldProps, remainingNewProps);
	},
};
export default CustomPIXIComponent(behavior, 'SelectionBox');
