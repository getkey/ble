import { createContext, useContext } from 'react';

import { store } from 'src/models/';

const storeContext = createContext(store);

export function useStore() {
	return useContext(storeContext);
}
