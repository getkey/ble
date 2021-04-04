import { types, Instance, getParent } from 'mobx-state-tree';
import { nanoid } from 'nanoid';
import { Box, Vector, Polygon } from 'sat';

import { ILevel } from 'src/models/Level';
import AngleParams from 'src/models/AngleParams';
import PositionParams from 'src/models/PositionParams';
import TextParams from 'src/models/TextParams';
import { boxFromPolygons } from 'src/utils/geom';

const Params = types.compose(
	AngleParams,
	PositionParams,
	TextParams,
).views((self) => ({
	get asSatPolygons(): [Polygon] {
		const splitted = (self.copy.en as string).split('\n');
		const rows = splitted.length;
		const cols = splitted.reduce((acc, line) => Math.max(acc, line.length), 0);
		const width = cols * 16;
		const height = rows * 16;
		return [
			new Box(
				new Vector(
					self.x - width/2,
					self.y - height/2,
				),
				width,
				height,
			).toPolygon().translate(-width/2, -height/2).rotate(self.angle).translate(width/2, height/2),
		];
	},
})).views((self) => ({
	get asAabb(): Box {
		return boxFromPolygons(self.asSatPolygons);
	},
}));

const Text = types.model({
	id: types.optional(types.identifier, nanoid),
	type: types.literal('text'),
	params: Params,
}).actions((self) => ({
	remove(): void {
		const parent = (getParent(self, 2) as ILevel);
		parent.removeEntity(self as IText);
	},
})).views(() => ({
	get displayName(): string {
		return 'Text';
	},
}));
export default Text;
// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface IText extends Instance<typeof Text> {}
