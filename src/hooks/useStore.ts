import { createContext, useContext } from 'react';

import { IRootStore } from 'src/models/RootStore';

const storeContext = createContext<IRootStore | null>(null);
storeContext.displayName = 'storeContext';

export function useStore(): IRootStore {
	const store = useContext(storeContext);
	if (store === null) {
		throw new Error('Store cannot be null, please add a context provider');
	}
	return store;
}

export const StoreProvider = storeContext.Provider;
