import { AmmoType, AddType, BlockType } from 'src/types/entity';

export const addTypeAliases = {
	[AddType.normalBlock]: 'Normal polygon',
	[AddType.iceBlock]: 'Ice polygon',
	[AddType.breakableBlock]: 'Breakable polygon',
	[AddType.deadlyBlock]: 'Fire polygon',
	[AddType.bouncyBlock]: 'Bouncy polygon',
	[AddType.normalBall]: 'Normal circle',
	[AddType.iceBall]: 'Ice circle',
	[AddType.breakableBall]: 'Breakable circle',
	[AddType.deadlyBall]: 'Fire circle',
	[AddType.bouncyBall]: 'Bouncy circle',
	[AddType.endpoint]: 'Door',
	[AddType.player]: 'Hoppi',
	[AddType.text]: 'Text',
};

export const addTypeToBlock = {
	[AddType.normalBlock]: BlockType.normal,
	[AddType.iceBlock]: BlockType.ice,
	[AddType.breakableBlock]: BlockType.breakable,
	[AddType.deadlyBlock]: BlockType.deadly,
	[AddType.bouncyBlock]: BlockType.bouncy,
	[AddType.normalBall]: BlockType.normal,
	[AddType.iceBall]: BlockType.ice,
	[AddType.breakableBall]: BlockType.breakable,
	[AddType.deadlyBall]: BlockType.deadly,
	[AddType.bouncyBall]: BlockType.bouncy,
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
