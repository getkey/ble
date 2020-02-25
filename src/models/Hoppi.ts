import { types, Instance } from 'mobx-state-tree';

import { AmmoType } from 'src/types/entity';

const ParamsBase = types.model({
	x: types.number,
	y: types.number,
	angle: 0,
});

export const InfiniteParams = types.compose(ParamsBase,
	types.model({
		infiniteAmmo: types.enumeration(Object.values(AmmoType)),
	}),
).actions((self) => ({
	setInfiniteType(type: AmmoType): void {
		self.infiniteAmmo = type;
	},
}));

const Magazine = types.array(types.enumeration(Object.values(AmmoType)));

export const FiniteParams = types.compose(ParamsBase,
	types.model({
		magazine: Magazine,
	}),
).views((self) => ({
	get stringFormat(): string {
		return self.magazine.map((ammo) => {
			switch (ammo) {
				case AmmoType.grenade:
					return 'g';
				case AmmoType.bullet:
					return 'b';
			}
		}).join('');
	},
})).actions((self) => ({
	setFromStringFormat(str: string): void {
		const newMag = str.split('').map((char) => {
			switch (char) {
				case 'g':
					return AmmoType.grenade;
				case 'b':
					return AmmoType.bullet;
				default:
					throw new Error('Invalid character');
			}
		});

		self.magazine = Magazine.create(newMag);
	},
}));

const Hoppi = types.model({
	id: types.identifier,
	type: types.literal('player'),
	params: types.union(
		FiniteParams,
		InfiniteParams,
	),
}).actions((self) => ({
	move(deltaX: number, deltaY: number): void {
		self.params.x += deltaX;
		self.params.y += deltaY;
	},
	makeFinite(): void {
		self.params = FiniteParams.create({
			x: self.params.x,
			y: self.params.y,
			magazine: [],
		});
	},
	makeInfinite(): void {
		self.params = InfiniteParams.create({
			x: self.params.x,
			y: self.params.y,
			infiniteAmmo: AmmoType.grenade,
		});
	},
	setAngle(angle: number): void {
		self.params.angle = angle;
	},
})).views((self) => ({
	get entityType(): 'finite' | 'infinite' {
		if (InfiniteParams.is(self.params)) {
			return 'infinite';
		}
		if (FiniteParams.is(self.params)) {
			return 'finite';
		}

		throw new Error('Invalid param type');
	},
	get displayName(): string {
		return 'Hoppi';
	},
}));
export default Hoppi;
// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface IHoppi extends Instance<typeof Hoppi> {}
