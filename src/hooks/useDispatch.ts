import { Subject } from 'rxjs';
import { createContext, useContext } from 'react';
import { Actions } from 'src/types/actions';

const dispatchContext = createContext<Subject<Actions> | null>(null);
dispatchContext.displayName = 'dispatchContext';

export function useDispatch(): (action: Actions) => void {
	const action$ = useContext(dispatchContext);
	if (action$ === null) {
		throw new Error('dispatch cannot be null, please add a context provider');
	}
	return (action: Actions): void => {
		action$.next(action);
	};
}

export const DispatchProvider = dispatchContext.Provider;
