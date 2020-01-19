import { types } from 'mobx-state-tree';

import Entity from 'src/models/Entity';

export default types.model({
	timings: types.refinement(types.array(types.integer), (value) => value !== undefined && value.length === 2),
	entities: types.array(Entity),
});
