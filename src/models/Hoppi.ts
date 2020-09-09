import { types, Instance, getParent } from 'mobx-state-tree';
import { nanoid } from 'nanoid';

import { AmmoType } from 'src/types/entity';
import { ILevel } from 'src/models/Level';

const ParamsBase = types.model({
	x: types.number,
	y: types.number,
	angle: 0,
	isStatic: false,
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
				case AmmoType.empty:
					return 'e';
			}
		}).join('');
	},
})).actions((self) => ({
	setFromStringFormat(str: string): void {
		const newMag = str.split('').map((char) => {
			switch (char) {
				case 'g':
				case 'G':
					return AmmoType.grenade;
				case 'b':
				case 'B':
					return AmmoType.bullet;
				case 'e':
				case 'E':
					return AmmoType.empty;
				default:
					throw new Error('Invalid character');
			}
		});

		self.magazine = Magazine.create(newMag);
	},
}));

const Hoppi = types.model({
	id: types.optional(types.identifier, nanoid),
	type: types.literal('player'),
	params: types.union(
		{
			dispatcher: (snapshot) => {
				if(Object.prototype.hasOwnProperty.call(snapshot, 'infiniteAmmo')) return InfiniteParams;
				return FiniteParams;
			},
		},
		FiniteParams,
		InfiniteParams,
	),
}).actions((self) => ({
	move(deltaX: number, deltaY: number): void {
		self.params.x += deltaX;
		self.params.y += deltaY;
	},
	setIsStatic(isStatic: boolean): void {
		self.params.isStatic = isStatic;
	},
	setAngle(angle: number): void {
		self.params.angle = angle;
	},
	makeFinite(): void {
		self.params = FiniteParams.create({
			x: self.params.x,
			y: self.params.y,
			angle: self.params.angle,
			magazine: [],
		});
	},
	makeInfinite(): void {
		self.params = InfiniteParams.create({
			x: self.params.x,
			y: self.params.y,
			angle: self.params.angle,
			infiniteAmmo: AmmoType.grenade,
		});
	},
	remove(): void {
		const parent = (getParent(self, 2) as ILevel);
		parent.removeEntity(self as IHoppi);
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
	get isValid(): boolean {
		return true;
	},
}));
export default Hoppi;
// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface IHoppi extends Instance<typeof Hoppi> {}
