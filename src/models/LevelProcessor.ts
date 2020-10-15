import { types } from 'mobx-state-tree';

import { levelPreProcessor } from 'src/utils/snapshot';
import Level from 'src/models/Level';
import { SerializedLevel } from 'src/types/snapshot';
import { polygonArea } from 'src/utils/geom';
import { AccessibilityManager } from 'pixi.js';
import { number } from 'mobx-state-tree/dist/internal';


const LevelProcessor = types.snapshotProcessor(Level, {
	preProcessor: levelPreProcessor,
	// from instance to snapshot
	postProcessor({ ...sn }): SerializedLevel {
		const level = {
			...sn,
			formatVersion: 0,
			entities: Object.values(sn.entities).reduce((entities, { id, ...stuff }) => {	
				// @ts-ignore
				if (stuff.params !== undefined && stuff.params.vertices !== undefined) {
					// check area of polygon
					if ('vertices' in stuff.params) {
						if (polygonArea(stuff.params.vertices) === 0) {
							console.log('Discarded empty shape', stuff);
							// discard empty shape
							return entities;
						}
					}

					// this should be done as a processor in models/Point.ts but it breaks
					// cue hack							
					entities.push({
						...stuff,
						params: {
							...stuff.params,
							// @ts-ignore
							vertices: stuff.params.vertices.map(({ id: id_, ...stuff_}) => ({
								...stuff_,
							})),
						},
					});
					return entities;
				}

				/*if (stuff.type === 'text') {
					entities.push({
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
					});
					return entities;
				}*/

				/*entities.push({
					...stuff,
				});*/
				return entities;
			}, []),
		};
		// @ts-ignore
		return level;
	},
});

export default LevelProcessor;
