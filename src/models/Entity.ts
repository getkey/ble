import { types, SnapshotOut } from 'mobx-state-tree';

import Block, { IBlock } from 'src/models/Block';
import Ball, { IBall } from 'src/models/Ball';
import Door, { IDoor } from 'src/models/Door';
import Hoppi, { IHoppi } from 'src/models/Hoppi';
import Text, { IText } from 'src/models/Text';

const Entity = types.union(Block, Ball, Door, Hoppi, Text);
export default Entity;
export type IEntity = IBlock | IDoor | IHoppi | IText | IBall;
export type SnapshotOutEntity = SnapshotOut<typeof Entity>;
