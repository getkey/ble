import { encode, decode } from '@msgpack/msgpack';
// workaround https://github.com/LZMA-JS/LZMA-JS/issues/35#issuecomment-589223628
import { LZMA_WORKER } from 'lzma/src/lzma_worker.js';
import { toByteArray, fromByteArray } from 'base64-js';
import { validatePrefab } from 'bombhopperio-level-tools';

import { SerializedEntity } from 'src/types/snapshot';

export function serializePrefab(entities: Array<SerializedEntity>): Promise<string> {
	const packed = encode(entities);

	return new Promise((resolve, reject) => {
		LZMA_WORKER.compress(packed, 1, (bytes: null | Array<number>, error?: Error) => {
			if (error || bytes === null) {
				reject(error);
				return;
			}

			const base64 = fromByteArray(Uint8Array.from(bytes));
			resolve(`data:application/vnd.bombhopperio-prefab+msgpack;compression=lzma;base64,${base64}`);
		});
	});
}

export function deserializePrefab(prefab: string): Promise<Array<SerializedEntity>> {
	return new Promise((resolve, reject) => {
		const matches = /^data:application\/vnd\.bombhopperio-prefab\+msgpack;compression=lzma;base64,(.+)$/.exec(prefab);
		if (!matches || matches.length < 2) {
			reject(new Error('No match detected'));
			return;
		}
		const b64 = matches[1];


		const byteArray = toByteArray(b64);

		LZMA_WORKER.decompress(byteArray, (bytes: null | Array<number>, error?: Error) => {
			if (error || bytes === null) {
				reject(error);
				return;
			}

			const deserialized = decode(bytes);

			try {
				validatePrefab(deserialized);
			} catch (err) {
				reject(err);
				return;
			}

			// TODO; check if this is a proper entity
			resolve(deserialized as Array<SerializedEntity>);
		});
	});
}
