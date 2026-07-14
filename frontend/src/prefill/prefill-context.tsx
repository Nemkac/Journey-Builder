import { createContext, useContext, useMemo, useReducer, type Dispatch, type ReactNode } from 'react';
import { initialPrefillState, prefillReducer, type PrefillAction, type PrefillState } from './prefill-reducer'
import type { SelectedPrefill } from './prefill.types';

const PrefillStateContext = createContext<PrefillState | null>(null);
const PrefillDispatchContext = createContext<Dispatch<PrefillAction> | null>(null);

export function PrefillProvider({ children }: { children: ReactNode }) {
    const [state, dispatch] = useReducer(prefillReducer, initialPrefillState);

    return (
        <PrefillStateContext.Provider value={state}>
            <PrefillDispatchContext.Provider value={dispatch}>
                {children}
            </PrefillDispatchContext.Provider>
        </PrefillStateContext.Provider>
    );
};

export function usePrefillState(): PrefillState {
    const state = useContext(PrefillStateContext);
    if (state === null) {
        throw new Error("usePrefillState must be inside a <PrefillProvider>");
    }
    return state;
};

export function useFieldPrefill(nodeId: string, fieldId: string): SelectedPrefill | undefined {
    return usePrefillState()[nodeId]?.[fieldId];
};

export function usePrefillDispatch(): Dispatch<PrefillAction> {
    const dispatch = useContext(PrefillDispatchContext);
    if (dispatch === null) {
        throw new Error("usePrefillDispatch must be inside a <PrefillProvider>");
    }

    return dispatch;
};

export function usePrefillActions() {
    const dispatch = usePrefillDispatch();
    return useMemo(() => ({
        setPrefill: (nodeId: string, fieldId: string, selection: SelectedPrefill) =>
            dispatch({ type: "SET_PREFILL", nodeId, fieldId, selection }),
        clearPrefill: (nodeId: string, fieldId: string) =>
            dispatch({ type: "CLEAR_PREFILL", nodeId, fieldId })
    }),
        [dispatch])
};

