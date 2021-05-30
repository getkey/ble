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

declare module 'poly-decomp' {
	type PolyDecompPolygon = Array<[number, number]>;
	export function isSimple(polygon: PolyDecompPolygon): boolean;
	export function makeCCW(polygon: PolyDecompPolygon): boolean;
	export function quickDecomp(polygon: PolyDecompPolygon): Array<PolyDecompPolygon>;
	export function decomp(polygon: PolyDecompPolygon): Array<PolyDecompPolygon>;
	export function removeCollinearPoints(polygon: PolyDecompPolygon, thresholdAngle: number): number;
	export function removeDuplicatePoints(polygon: PolyDecompPolygon, precision: number): void;
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
