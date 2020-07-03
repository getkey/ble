// we need the verbose syntax to make this trick https://github.com/mobxjs/mobx-state-tree/issues/605#issuecomment-537545915 work
// see src/models/Block.ts
export enum BlockType {
	normal = 'normal',
	ice = 'ice',
	breakable = 'breakable',
	deadly = 'deadly',
	bouncy = 'bouncy',
}

export enum AddType {
	player = 'player',
	endpoint = 'endpoint',
	text = 'text',
	normalBlock = 'normalBlock',
	iceBlock = 'iceBlock',
	breakableBlock = 'breakableBlock',
	deadlyBlock = 'deadlyBlock',
	bouncyBlock = 'bouncyBlock',
	normalBall = 'normalBall',
	iceBall = 'iceBall',
	breakableBall = 'breakableBall',
	deadlyBall = 'deadlyBall',
	bouncyBall = 'bouncyBall',
}

export enum AmmoType {
	bullet = 'bullet',
	grenade = 'grenade',
	empty = 'empty',
}

export const blockAddTypes = [
	AddType.normalBlock,
	AddType.iceBlock,
	AddType.breakableBlock,
	AddType.deadlyBlock,
	AddType.bouncyBlock,
];

export const ballAddTypes = [
	AddType.normalBall,
	AddType.iceBall,
	AddType.breakableBall,
	AddType.deadlyBall,
	AddType.bouncyBall,
];
