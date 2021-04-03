import { CustomPIXIComponent } from 'react-pixi-fiber';
import { Graphics, Point, Texture, SCALE_MODES } from 'pixi.js';
import { Box } from 'sat';

import { selectColor } from 'src/config';

import invalidPolygon from 'static/invalid_polygon.png';

const invalidPolygonTexture = Texture.from(invalidPolygon, {
	scaleMode: SCALE_MODES.NEAREST,
});

type Props = {
	fill: number;
	points: Array<Point>;
	isSelected: boolean;
	showInvalidTexture: boolean;
	aabb: Box;
};

export const behavior = {
	customDisplayObject: (): Graphics => new Graphics(),
	customApplyProps: function(instance: Graphics, oldProps: Props, newProps: Props): void {
		const { fill: oldFill, points: oldPoints, isSelected: oldIsSelected, showInvalidTexture: oldShowInvalidTexture, aabb: oldAabb, ...remainingOldProps } = oldProps;
		const { fill, points, isSelected, showInvalidTexture, aabb, ...remainingNewProps } = newProps;

		if (fill !== oldFill || points !== oldPoints || isSelected !== oldIsSelected || showInvalidTexture !== oldShowInvalidTexture || aabb !== oldAabb) {
			instance.clear();

			instance.beginFill(fill);
			instance.drawPolygon(points);
			instance.endFill();

			if (isSelected) {
				instance.lineStyle(2, selectColor);
				instance.beginFill(0xffffff, 0);
				instance.drawRect(aabb.pos.x, aabb.pos.y, aabb.w, aabb.h);
				instance.endFill();
			}

			if (showInvalidTexture) {
				instance.beginTextureFill({
					texture: invalidPolygonTexture,
					color: 0xff0000,
				});
				instance.drawPolygon(points);
				instance.endFill();
			}
		}

		// @ts-ignore
		this.applyDisplayObjectProps(remainingOldProps, remainingNewProps);
	},
};
export default CustomPIXIComponent(behavior, 'Polygon');
