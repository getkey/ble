import { SnapshotInLevel } from 'src/models/Level';
import { SerializedLevel } from 'src/types/snapshot';
import { BlockType } from 'src/types/entity';
import { nanoid } from 'nanoid';

export function levelPreProcessor(snapshot: SerializedLevel): SnapshotInLevel {
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
