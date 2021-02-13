import { getSnapshot } from 'mobx-state-tree';

import Entity, { SnapshotOutEntity, IEntity } from 'src/models/Entity';

export function cloneEntity(entity: IEntity): IEntity {
	const snapshot = getSnapshot<SnapshotOutEntity>(entity);
	return Entity.create({
		...snapshot,
	});
}
