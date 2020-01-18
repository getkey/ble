import { CustomPIXIComponent } from 'react-pixi-fiber';
import { Graphics, interaction } from 'pixi.js';

type Props = {
	fill: number;
	x: number;
	y: number;
	radius: number;
	// TODO: remove once fixed https://github.com/michalochman/react-pixi-fiber/pull/109
	interactive: boolean;
	pointerdown: (ev: interaction.InteractionEvent) => void;
	// END TODO
};

export const behavior = {
	customDisplayObject: (): Graphics => new Graphics(),
	customApplyProps: function(instance: Graphics, oldProps: Props, newProps: Props): void {
		const { fill: oldFill, x: oldX, y: oldY, radius: oldRadius, ...remainingOldProps } = oldProps;
		const { fill, x, y, radius, ...remainingNewProps } = newProps;
		instance.clear();

		instance.beginFill(fill);
		instance.drawCircle(x, y, radius);
		instance.endFill();

		// eslint-disable-next-line @typescript-eslint/ban-ts-ignore
		// @ts-ignore
		this.applyDisplayObjectProps(remainingOldProps, remainingNewProps);
	},
};
export default CustomPIXIComponent(behavior, 'Point');
