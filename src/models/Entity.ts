import { types, SnapshotOut } from 'mobx-state-tree';

import Block, { IBlock } from 'src/models/Block';
import Ball, { IBall } from 'src/models/Ball';
import Door, { IDoor } from 'src/models/Door';
import Hoppi, { IHoppi } from 'src/models/Hoppi';
import Text, { IText } from 'src/models/Text';
import Paint, { IPaint } from 'src/models/Paint';

const Entity = types.snapshotProcessor(
	types.union(Block, Ball, Door, Hoppi, Text, Paint),
	{
		postProcessor({ id, ...stuff }) {
			return {
				...stuff,
			};
		},
	},
);
export default Entity;
export type IEntity = IBlock | IDoor | IHoppi | IText | IBall | IPaint;
export type SnapshotOutEntity = SnapshotOut<typeof Entity>;
