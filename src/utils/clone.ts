import { getSnapshot } from 'mobx-state-tree';
import { nanoid } from 'nanoid';

import Entity, { SnapshotOutEntity, IEntity } from 'src/models/Entity';
import Block, { SnapshotOutBlock } from 'src/models/Block';
import { SnapshotOutVertex } from 'src/models/Vertex';

export function cloneEntity(entity: IEntity): IEntity {
	if (Block.is(entity)) {
		const snapshot = getSnapshot<SnapshotOutBlock>(entity);
		return Block.create({
			...snapshot,
			id: nanoid(),
			params: {
				...snapshot.params,
				vertices: snapshot.params.vertices.map((vertex: SnapshotOutVertex) => ({
					...vertex,
					id: nanoid(),
				})),
			},
		});
	} else {
		const snapshot = getSnapshot<SnapshotOutEntity>(entity);
		return Entity.create({
			...snapshot,
			id: nanoid(),
		});
	}
}
