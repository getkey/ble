import { types, Instance, getParent } from 'mobx-state-tree';
import { nanoid } from 'nanoid';
import { Box, Vector, Polygon } from 'sat';

import { ILevel } from 'src/models/Level';
import StaticParams from 'src/models/StaticParams';
import AngleParams from 'src/models/AngleParams';
import PositionParams from 'src/models/PositionParams';
import DestinationParams from 'src/models/DestinationParams';
import RightFacingParams from 'src/models/RightFacingParams';
import { doorWidth, doorHeight } from 'src/config';
import { boxFromPolygons } from 'src/utils/geom';

const DoorParams = types.compose(
	StaticParams,
	AngleParams,
	PositionParams,
	DestinationParams,
	RightFacingParams,
).views((self) => ({
	get asSatPolygons(): [Polygon] {
		return [
			new Box(
				new Vector(
					self.x - doorWidth/2,
					self.y - doorHeight/2,
				),
				doorWidth,
				doorHeight,
			).toPolygon().translate(-doorWidth/2, -doorHeight/2).rotate(self.angle).translate(doorWidth/2, doorHeight/2),
		];
	},
})).views((self) => ({
	get asAabb(): Box {
		return boxFromPolygons(self.asSatPolygons);
	},
}));

const Door = types.model({
	id: types.optional(types.identifier, nanoid),
	type: types.literal('endpoint'),
	params: DoorParams,
}).actions((self) => ({
	remove(): void {
		const parent = (getParent(self, 2) as ILevel);
		parent.removeEntity(self as IDoor);
	},
})).views(() => ({
	get displayName(): string {
		return 'Door';
	},
}));
export default Door;
// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface IDoor extends Instance<typeof Door> {}
