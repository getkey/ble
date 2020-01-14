import { createContext, useContext } from 'react';

const storeContext = createContext(null);
storeContext.displayName = 'storeContext';

export function useStore() {
	const store = useContext(storeContext);
	if (store === null) {
		throw new Error('Store cannot be null, please add a context provider');
	}
	return store;
}

export const StoreProvider = storeContext.Provider;
