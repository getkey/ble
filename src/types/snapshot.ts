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
type Text = {
	type: 'text';
	params: {
		x: number;
		y: number;
		anchor: {
			x: number;
			y: number;
		};
		copy: {
			en: string;
			[index: string]: string;
		};
	};
};

type Hoppi = {
	type: 'player';
	params: {
		x: number;
		y: number;
		angle?: number;
		infiniteAmmo: 'bullet' | 'grenade';
	} | {
		x: number;
		y: number;
		angle?: number;
		magazine: Array<'bullet' | 'grenade'>;
	};
};

type Paint = {
	type: 'paint';
	params: {
		fillColor: number;
		vertices: Array<IPoint>;
	};
};

export type SerializedEntity = BlockEntity | Door | Hoppi | Text | Paint;

export type SerializedLevel = {
	formatVersion: number;
	name: string;
	timings: [number, number];
	entities: Array<SerializedEntity>;
};
