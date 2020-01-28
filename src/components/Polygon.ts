import { CustomPIXIComponent } from 'react-pixi-fiber';
import { Graphics, Point, interaction } from 'pixi.js';

type Props = {
	fill: number;
	points: Array<Point>;
	isSelected: boolean;
	// TODO: remove once fixed https://github.com/michalochman/react-pixi-fiber/pull/109
	interactive: boolean;
	pointerdown: (ev: interaction.InteractionEvent) => void;
	// END TODO
};

export const behavior = {
	customDisplayObject: (): Graphics => new Graphics(),
	customApplyProps: function(instance: Graphics, oldProps: Props, newProps: Props): void {
		const { fill: oldFill, points: oldPoints, isSelected: oldIsSelected, ...remainingOldProps } = oldProps;
		const { fill, points, isSelected, ...remainingNewProps } = newProps;

		instance.clear();

		if (isSelected) {
			instance.lineStyle(2, 0xff0000);
		}
		instance.beginFill(fill);
		instance.drawPolygon(points);
		instance.endFill();

		// eslint-disable-next-line @typescript-eslint/ban-ts-ignore
		// @ts-ignore
		this.applyDisplayObjectProps(remainingOldProps, remainingNewProps);
	},
};
export default CustomPIXIComponent(behavior, 'Polygon');
