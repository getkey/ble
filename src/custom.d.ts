declare module '*.svg' {
	const content: string;
	export default content;
}
declare module '*.png' {
	const content: string;
	export default content;
}
declare module '*.fnt' {
	const content: string;
	export default content;
}
declare module '*.json' {
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
    const content: any;
    export default content;
}

type PolyDecompPolygon = Array<[number, number]>;
declare module 'poly-decomp' {
	export function makeCCW(polygon: PolyDecompPolygon): PolyDecompPolygon;
	export function quickDecomp(polygon: PolyDecompPolygon): Array<PolyDecompPolygon>;
	export function decomp(polygon: PolyDecompPolygon): Array<PolyDecompPolygon>;
}

interface OnFinish {
	(result: Array<number>): void;
	(result: null, error: Error): void;
}

declare module 'lzma/src/lzma_worker.js' {
	export const LZMA_WORKER: {
		compress(content: Uint8Array, mode: number, onFinish: OnFinish): void;
		decompress(content: Uint8Array, onFinish: OnFinish): void;
	};
}
