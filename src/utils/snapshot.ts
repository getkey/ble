import { SnapshotInEntity } from 'src/models/Entity';
import { SnapshotInLevel } from 'src/models/Level';
import { SerializedLevel } from 'src/types/snapshot';
import { EntityType } from 'src/types/entity';

type EntityObj = {
	[key: string]: SnapshotInEntity;
};


export function levelPreProcessor(snapshot: SerializedLevel): SnapshotInLevel {
	const entities = snapshot.entities.reduce((acc: EntityObj, entity, i) => {
		const id = i.toString();
		const ent = {
			...entity,
			type: entity.type as EntityType,
			id,
		};
		acc[id] = ent;

		return acc;
	}, {});

	return {
		...snapshot,
		timings: snapshot.timings || [0, 0],
		entities,
		entityIdCounter: snapshot.entities.length,
	};
}
