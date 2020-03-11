/* eslint-disable @typescript-eslint/ban-ts-ignore */
import { types } from 'mobx-state-tree';

import { levelPreProcessor } from 'src/utils/snapshot';
import Level from 'src/models/Level';
import { SerializedLevel } from 'src/types/snapshot';

const LevelProcessor = types.snapshotProcessor(Level, {
	preProcessor: levelPreProcessor,
	// from instance to snapshot
	postProcessor({ ...sn }): SerializedLevel {
		const level = {
			...sn,
			entities: Object.values(sn.entities).map(({ id, ...stuff }) => {
				// @ts-ignore
				if (stuff.params !== undefined && stuff.params.vertices !== undefined) {
					// this should be done as a processor in models/Point.ts but it breaks
					// cue hack
					return {
						...stuff,
						params: {
							...stuff.params,
							// @ts-ignore
							vertices: stuff.params.vertices.map(({ id: id_, ...stuff_}) => ({
								...stuff_,
							})),
						},
					};
				}

				return {
					...stuff,
				};
			}),
		};
		// @ts-ignore
		return level;
	},
});

export default LevelProcessor;
