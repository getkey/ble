import { types } from 'mobx-state-tree';

import Block, { IBlock } from 'src/models/Block';
import Door, { IDoor } from 'src/models/Door';
import Hoppi, { IHoppi } from 'src/models/Hoppi';

const Entity = types.union(Block, Door, Hoppi);
export default Entity;
export type IEntity = IBlock | IDoor | IHoppi;
