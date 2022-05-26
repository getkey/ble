import { types } from 'mobx-state-tree';

const ColorParams = types.model({
	fillColor: types.optional(
		types.refinement(
			types.number,
			(value) => value >= 0x000000 && value <= 0xffffff,
		),
		0xffffff,
	),
}).actions((self) => ({
	setFillColor(fillColor: number) {
		self.fillColor = fillColor;
	},
}));

export default ColorParams;
