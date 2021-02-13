import { types } from 'mobx-state-tree';

const ColorParams = types.model({
	fillColor: 0xffffff,
}).actions((self) => ({
	setFillColor(fillColor: number) {
		self.fillColor = fillColor;
	},
}));

export default ColorParams;
