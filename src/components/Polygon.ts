import { CustomPIXIComponent } from 'react-pixi-fiber';
import { Graphics, Point, Texture, SCALE_MODES } from 'pixi.js';

import invalidPolygon from 'static/invalid_polygon.png';
import { getFillColor, getLineColor } from 'src/utils/color';
import { lineWidth } from 'src/config';

const invalidPolygonTexture = Texture.from(invalidPolygon, {
	scaleMode: SCALE_MODES.NEAREST,
});

type Props = {
	fill: number;
	points: Array<Point>;
	showInvalidTexture: boolean;
};

export const behavior = {
	customDisplayObject: (): Graphics => new Graphics(),
	customApplyProps: function(instance: Graphics, oldProps: Props | undefined, newProps: Props): void {
		const { fill: oldFill, points: oldPoints, showInvalidTexture: oldShowInvalidTexture, ...remainingOldProps } = oldProps ?? {};
		const { fill, points, showInvalidTexture, ...remainingNewProps } = newProps;

		if (fill !== oldFill || points !== oldPoints || showInvalidTexture !== oldShowInvalidTexture) {
			instance.clear();

			// @ts-expect-error
			instance.lineStyle({
				width: lineWidth,
				color: getLineColor(fill),
				alignment: 0,
			});

			instance.beginFill(getFillColor(fill));
			instance.drawPolygon(points);
			instance.endFill();


			if (showInvalidTexture) {
				instance.beginTextureFill({
					texture: invalidPolygonTexture,
					color: 0xff0000,
				});
				instance.drawPolygon(points);
				instance.endFill();
			}
		}

		// @ts-expect-error
		this.applyDisplayObjectProps(remainingOldProps, remainingNewProps);
	},
};
export default CustomPIXIComponent(behavior, 'Polygon');