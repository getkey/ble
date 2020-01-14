import { types } from 'mobx-state-tree';

export default types.model({
	x: 0,
	y: 0,
}).actions((self) => ({
	set(x, y) {
		self.x = x;
		self.y = y;
	},
}));
