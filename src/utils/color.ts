import chroma from 'chroma-js';

import { darkSlateGray } from 'src/config';

export function getStrokeColor(color: number): number {
	return chroma.mix(chroma(color), chroma(darkSlateGray), 0.75).num();
}

export function getLineColor(color: number): number {
	return chroma(color).brighten(1).num();
}
