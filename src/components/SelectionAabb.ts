import { CustomPIXIComponent } from 'react-pixi-fiber';
import { Graphics } from 'pixi.js';
import { Box } from 'sat';

import { selectColor } from 'src/config';

type Props = {
	aabb: Box;
};

export const behavior = {
	customDisplayObject: (): Graphics => new Graphics(),
	customApplyProps: function(instance: Graphics, oldProps: Props | undefined, newProps: Props): void {
		const { aabb: oldAabb, ...remainingOldProps } = oldProps ?? {};
		const { aabb, ...remainingNewProps } = newProps;

		if (aabb !== oldAabb) {
			instance.clear();

			instance.lineStyle({
				width: 2,
				color: selectColor,
				alignment: 1,
			});
			instance.beginFill(0xffffff, 0);
			instance.drawRect(-aabb.w/2, -aabb.h/2, aabb.w, aabb.h);
		}

		// @ts-expect-error
		this.applyDisplayObjectProps(remainingOldProps, remainingNewProps);
	},
};
export default CustomPIXIComponent(behavior, 'SelectionAabb');
