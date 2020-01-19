// we need the verbose syntax to make this trick https://github.com/mobxjs/mobx-state-tree/issues/605#issuecomment-537545915 work
// see src/models/Entity.ts
export enum EntityType {
	normal = 'normal',
	ice = 'ice',
	breakable = 'breakable',
	deadly = 'deadly',
	bouncy = 'bouncy',
}
