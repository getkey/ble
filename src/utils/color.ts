import { utils } from 'pixi.js';
import { lab } from 'd3-color';
import { interpolateLab } from 'd3-interpolate';

import { darkSlateGray } from 'src/config';

export function getStrokeColor(color: number): number {
	return utils.string2hex(
		lab(
			interpolateLab(
				utils.hex2string(color),
				utils.hex2string(darkSlateGray),
			)(0.7),
		).formatHex(),
	);
}

export function getLineColor(color: number): number {
	return utils.string2hex(
		lab(utils.hex2string(color))
			.brighter(1.2)
			.formatHex(),
	);
}
