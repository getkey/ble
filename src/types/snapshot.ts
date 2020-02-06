import IPoint from 'src/types/point';

type BlockEntity = {
	type: 'normal' | 'ice' | 'breakable' | 'deadly' | 'bouncy';
	params: {
		vertices: Array<IPoint>;
		isStatic?: boolean;
	};
}

type Door = {
	type: 'endpoint';
	params: {
		x: number;
		y: number;
		isStatic?: boolean;
		rightFacing?: boolean;
	};
};

export type SerializedLevel = {
	timings: Array<number>; // TODO: make this a [number, number]
	entities: Array<BlockEntity | Door>;
};
