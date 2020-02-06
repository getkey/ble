import { types } from 'mobx-state-tree';

import Block, { IBlock } from 'src/models/Block';
import Door, { IDoor } from 'src/models/Door';

const Entity = types.union(Block, Door);
export default Entity;
export type IEntity = IBlock | IDoor;
