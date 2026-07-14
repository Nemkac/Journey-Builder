import { describe, expect, it } from "vitest";
import { formatPrefillDisplay, type SelectedPrefill } from "./prefill.types";
import { initialPrefillState, prefillReducer } from "./prefill-reducer";

const emailFromFormB: SelectedPrefill = {
    sourceId: "direct-dependencies",
    groupId: "node-b",
    groupLabel: "Form B",
    optionId: "email",
    optionLabel: "Email"
};

const nameFromGlobals: SelectedPrefill = {
    sourceId: "global-data",
    groupId: "action-properties",
    groupLabel: "Action Properties",
    optionId: "action_name",
    optionLabel: "Action Name"
};

const setEmailOnNodeD = {
    type: "SET_PREFILL",
    nodeId: "node-d",
    fieldId: "email",
    selection: emailFromFormB
} as const

describe("prefillReducer - SET_PREFILL", () => {
    it("creates the node and field entry on empty state", () => {
        const next = prefillReducer(initialPrefillState, setEmailOnNodeD);
        expect(next).toEqual({ "node-d": { email: emailFromFormB } });
    });

    it("keeps existing fields on the same node", () => {
        const withEmail = prefillReducer(initialPrefillState, setEmailOnNodeD);
        const next = prefillReducer(withEmail, {
            type: "SET_PREFILL",
            nodeId: "node-d",
            fieldId: "name",
            selection: nameFromGlobals
        });
        expect(next["node-d"]).toEqual({
            email: emailFromFormB,
            name: nameFromGlobals
        })
    });

    it("leaves other nodes mappings untouched", () => {
        const withEmail = prefillReducer(initialPrefillState, setEmailOnNodeD);
        const next = prefillReducer(withEmail, {
            type: "SET_PREFILL",
            nodeId: "node-f",
            fieldId: "name",
            selection: nameFromGlobals
        });
        expect(next["node-d"]).toEqual({ email: emailFromFormB });
        expect(next["node-f"]).toEqual({ name: nameFromGlobals });
    })
})

describe("prefillReducer - CLEAR_PREFILL", () => {
    it("removes exactly the cleared field", () => {
        const withTwoFields = prefillReducer(
            prefillReducer(initialPrefillState, setEmailOnNodeD),
            { type: "SET_PREFILL", nodeId: "node-d", fieldId: "name", selection: nameFromGlobals }
        );
        const next = prefillReducer(withTwoFields, {
            type: "CLEAR_PREFILL",
            nodeId: "node-d",
            fieldId: "email"
        });
        expect(next["node-d"]).toEqual({ name: nameFromGlobals });
    });

    it("returns the state object unchanged when nothing was set", () => {
        const next = prefillReducer(initialPrefillState, {
            type: "CLEAR_PREFILL",
            nodeId: "node-d",
            fieldId: "email"
        });
        expect(next).toBe(initialPrefillState);
    });
});

describe("prefillReducer - immutability", () => {
    it("never modifies the state it was given", () => {
        const before = prefillReducer(initialPrefillState, setEmailOnNodeD);
        prefillReducer(before, {
            type: "CLEAR_PREFILL",
            nodeId: "node-d",
            fieldId: "email"
        });
        prefillReducer(before, {
            type: "SET_PREFILL",
            nodeId: "node-d",
            fieldId: "name",
            selection: nameFromGlobals
        });
        expect(before).toEqual({ "node-d": { email: emailFromFormB } });
        expect(initialPrefillState).toEqual({});
    })
})

describe("formatPrefillDisplay", () => {
    it("joins group and option labels with a dot", () => {
        expect(formatPrefillDisplay(emailFromFormB)).toBe("Form B.Email");
    });
})