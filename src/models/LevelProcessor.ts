import { types } from 'mobx-state-tree';

import { levelPreProcessor } from 'src/utils/snapshot';
import Level from 'src/models/Level';
import { SerializedLevel } from 'src/types/snapshot';

const LevelProcessor = types.snapshotProcessor(Level, {
	preProcessor: levelPreProcessor,
	// from instance to snapshot
	postProcessor({ ...sn}): SerializedLevel {
		const level = {
			...sn,
			entities: Object.values(sn.entities).map(({ id, ...params }) => ({
				...params,
			})),
		};
		return level;
	},
});

export default LevelProcessor;
