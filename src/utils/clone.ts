import { getSnapshot } from 'mobx-state-tree';

import Entity, { SnapshotOutEntity, IEntity } from 'src/models/Entity';
import { entityPostProcessor } from 'src/utils/snapshot';

export function cloneEntity(entity: IEntity): IEntity {
	const snapshot = entityPostProcessor(getSnapshot<SnapshotOutEntity>(entity));
	// @ts-ignore
	return Entity.create(snapshot);
}
