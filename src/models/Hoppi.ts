import { types, Instance, getParent } from 'mobx-state-tree';
import { nanoid } from 'nanoid';
import { Box, Vector, Polygon } from 'sat';

import { AmmoType } from 'src/types/entity';
import { ILevel } from 'src/models/Level';
import { reverse } from 'src/utils/string';
import StaticParams from 'src/models/StaticParams';
import AngleParams from 'src/models/AngleParams';
import PositionParams from 'src/models/PositionParams';
import { hoppiSize } from 'src/config';
import { boxFromPolygons } from 'src/utils/geom';

const ParamsBase = types.compose(
	StaticParams,
	AngleParams,
	PositionParams,
	types.model({
		isStatic: false, // bypasses StaticParams's default
	}),
).views((self) => ({
	get asSatPolygons(): [Polygon] {
		return [
			new Box(
				new Vector(
					self.x - hoppiSize/2,
					self.y - hoppiSize/2,
				),
				hoppiSize,
				hoppiSize,
			).toPolygon().translate(-hoppiSize/2, -hoppiSize/2).rotate(self.angle).translate(hoppiSize/2, hoppiSize/2),
		];
	},
})).views((self) => ({
	get asAabb(): Box {
		return boxFromPolygons(self.asSatPolygons);
	},
}));

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
		const mag = self.magazine.map((ammo) => {
			switch (ammo) {
				case AmmoType.grenade:
					return 'g';
				case AmmoType.bullet:
					return 'b';
				case AmmoType.empty:
					return 'e';
			}
		}).join('');

		return reverse(mag);
	},
})).actions((self) => ({
	setFromStringFormat(str: string): void {
		const newMag = reverse(str).split('').map((char) => {
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
	makeFinite(): void {
		self.params = FiniteParams.create({
			...self.params,
			magazine: [
				AmmoType.grenade,
				AmmoType.empty,
				AmmoType.bullet,
				AmmoType.bullet,
			],
		});
	},
	makeInfinite(): void {
		self.params = InfiniteParams.create({
			...self.params,
			infiniteAmmo: AmmoType.bullet,
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
}));
export default Hoppi;
// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface IHoppi extends Instance<typeof Hoppi> {}
// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface IInfiniteParams extends Instance<typeof InfiniteParams> {}
// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface IFiniteParams extends Instance<typeof FiniteParams> {}
