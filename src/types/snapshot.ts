import IPoint from 'src/types/point';

export type SerializedLevel = {
	timings: Array<number>; // TODO: make this a [number, number]
	entities: Array<{
		type: string;
		params: {
			vertices: Array<IPoint>;
			isStatic?: boolean;
		};
	}>;
};
