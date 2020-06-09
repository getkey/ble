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
			formatVersion: 0,
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

				if (stuff.type === 'text') {
					return {
						...stuff,
						params: {
							...stuff.params,
							copy: Object.entries(stuff.params.copy).reduce((acc, [code, text]) => {
								if (text === undefined) return acc;

								if (code !== 'en' && text === '') {
									return acc;
								}

								acc[code] = text;
								return acc;
							}, {} as { [index: string]: string }),
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
