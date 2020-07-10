import { CustomPIXIComponent } from 'react-pixi-fiber';
import { Graphics, Point, Texture, SCALE_MODES } from 'pixi.js';

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
};

export const behavior = {
	customDisplayObject: (): Graphics => new Graphics(),
	customApplyProps: function(instance: Graphics, oldProps: Props, newProps: Props): void {
		const { fill: oldFill, points: oldPoints, isSelected: oldIsSelected, showInvalidTexture: oldShowInvalidTexture, ...remainingOldProps } = oldProps;
		const { fill, points, isSelected, showInvalidTexture, ...remainingNewProps } = newProps;

		instance.clear();

		if (isSelected) {
			instance.lineStyle(2, selectColor);
		}

		instance.beginFill(fill);
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

		// @ts-ignore
		this.applyDisplayObjectProps(remainingOldProps, remainingNewProps);
	},
};
export default CustomPIXIComponent(behavior, 'Polygon');
