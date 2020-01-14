import { types } from 'mobx-state-tree';

import Point from 'src/models/Point.js';

export default types.array(
	types.model({
		vertices: types.array(Point),
	})
);
