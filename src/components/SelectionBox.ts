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
		const { width: oldWidth, height: oldHeight, ...remainingOldProps } = oldProps;
		const { width, height, ...remainingNewProps } = newProps;

		if (width !== oldWidth || height !== oldHeight) {
			instance.clear();

			instance.lineStyle(1, selectColor);
			instance.beginFill(selectColor, 0.2);
			instance.drawRect(0, 0, width, height);
			instance.endFill();
		}

		// @ts-expect-error
		this.applyDisplayObjectProps(remainingOldProps, remainingNewProps);
	},
};
export default CustomPIXIComponent(behavior, 'SelectionBox');
