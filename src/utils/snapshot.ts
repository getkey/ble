import { nanoid } from 'nanoid';

import { SnapshotOutBaseLevel, SnapshotInBaseLevel } from 'src/models/Level';
import { SnapshotOutEntity } from 'src/models/Entity';
import { SerializedLevel, SerializedEntity } from 'src/types/snapshot';
import { BlockType } from 'src/types/entity';

export function entityPostProcessor({ id, ...stuff }: SnapshotOutEntity): SerializedEntity {
	// removing the ids can't be done in the Entity or the Vertex because it breacks the undo
	// function that need ids to be consistent
	const params = { ...stuff.params };
	if ('vertices' in params) {
		// @ts-expect-error
		params.vertices = params.vertices.map(({ id: id_, ...stuff_ }) => ({
			...stuff_,
		}));
	}
	if ('destination' in params && params.destination === undefined) {
		delete params.destination;
	}

	// @ts-expect-error
	return {
		...stuff,
		params,
	};
}

export function levelPreProcessor(snapshot: SerializedLevel): SnapshotInBaseLevel {
	const entities = snapshot.entities.map((entity) => ({
		...entity,
		type: entity.type as BlockType,
		id: nanoid(),
	}));

	return {
		...snapshot,
		timings: snapshot.timings ?? [0, 0],
		entities,
	};
}

export function levelPostProcessor({ ...sn }: SnapshotOutBaseLevel): SerializedLevel {
	// removing the ids can't be done in the Entity or the Vertex because it breacks the undo
	// function that need ids to be consistent
	const level = {
		...sn,
		formatVersion: 0,
		entities: Object.values(sn.entities).map(entityPostProcessor),
	};
	// @ts-expect-error
	return level;
}
