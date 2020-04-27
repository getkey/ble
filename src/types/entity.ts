// we need the verbose syntax to make this trick https://github.com/mobxjs/mobx-state-tree/issues/605#issuecomment-537545915 work
// see src/models/Block.ts
export enum BlockType {
	normal = 'normal',
	ice = 'ice',
	breakable = 'breakable',
	deadly = 'deadly',
	bouncy = 'bouncy',
}

export enum EntityType {
	normal = 'normal',
	ice = 'ice',
	breakable = 'breakable',
	deadly = 'deadly',
	bouncy = 'bouncy',
	endpoint = 'endpoint',
	player = 'player',
	text = 'text',
}

export enum AmmoType {
	bullet = 'bullet',
	grenade = 'grenade',
}
