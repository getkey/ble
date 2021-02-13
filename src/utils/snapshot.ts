import { SnapshotInBaseLevel } from 'src/models/Level';
import { SerializedLevel } from 'src/types/snapshot';
import { BlockType } from 'src/types/entity';
import { nanoid } from 'nanoid';

export function levelPreProcessor(snapshot: SerializedLevel): SnapshotInBaseLevel {
	const entities = snapshot.entities.map((entity) => ({
		...entity,
		type: entity.type as BlockType,
		id: nanoid(),
	}));

	return {
		...snapshot,
		timings: snapshot.timings || [0, 0],
		entities,
	};
}

export function levelPostProcessor({ ...sn }: SnapshotInBaseLevel): SerializedLevel {
	const level = {
		...sn,
		formatVersion: 0,
	};
	// @ts-ignore
	return level;
}
