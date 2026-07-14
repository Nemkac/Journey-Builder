import type { SelectedPrefill } from "./prefill.types";

export type PrefillState = Record<string, Record<string, SelectedPrefill>>;

export type PrefillAction =
    | { type: "SET_PREFILL"; nodeId: string, fieldId: string, selection: SelectedPrefill }
    | { type: "CLEAR_PREFILL", nodeId: string, fieldId: string };

export const initialPrefillState: PrefillState = {};

export function prefillReducer(state: PrefillState, action: PrefillAction): PrefillState {
    switch (action.type) {
        case "SET_PREFILL": {
            const nodeMappings = state[action.nodeId] ?? {};
            return {
                ...state,
                [action.nodeId]: {
                    ...nodeMappings,
                    [action.fieldId]: action.selection
                }
            };
        }

        case "CLEAR_PREFILL": {
            const nodeMappings = state[action.nodeId];
            if (!nodeMappings || !(action.fieldId in nodeMappings)) return state;
            const remaining = { ...nodeMappings };
            delete remaining[action.fieldId]
            return { ...state, [action.nodeId]: remaining }
        }
    }

    return action satisfies never;
}