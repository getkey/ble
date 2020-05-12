import { AmmoType, EntityType, BlockType } from 'src/types/entity';

export const entityAliases = {
	[EntityType.normal]: 'Normal',
	[EntityType.ice]: 'Ice',
	[EntityType.breakable]: 'Breakable',
	[EntityType.deadly]: 'Fire',
	[EntityType.bouncy]: 'Bouncy',
	[EntityType.endpoint]: 'Door',
	[EntityType.player]: 'Hoppi',
	[EntityType.text]: 'Text',
};

export const blockAliases = {
	[BlockType.normal]: 'Normal',
	[BlockType.ice]: 'Ice',
	[BlockType.breakable]: 'Breakable',
	[BlockType.deadly]: 'Fire',
	[BlockType.bouncy]: 'Bouncy',
};

export const ammoAliases = {
	[AmmoType.bullet]: 'Bomb',
	[AmmoType.grenade]: 'Grenade',
	[AmmoType.empty]: 'Empty',
};
