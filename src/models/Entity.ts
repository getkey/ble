import { types, SnapshotOut } from 'mobx-state-tree';

import Block, { IBlock } from 'src/models/Block';
import Door, { IDoor } from 'src/models/Door';
import Hoppi, { IHoppi } from 'src/models/Hoppi';
import Text, { IText } from 'src/models/Text';

const Entity = types.union(Block, Door, Hoppi, Text);
export default Entity;
export type IEntity = IBlock | IDoor | IHoppi | IText;
export type SnapshotOutEntity = SnapshotOut<typeof Entity>;
