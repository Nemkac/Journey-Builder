import type { ReactNode } from "react";
import type { SelectedPrefill } from "./prefill.types";
import { PrefillProvider, useFieldPrefill, usePrefillActions, usePrefillState } from "./prefill-context";
import { act, renderHook } from "@testing-library/react";
import { describe, expect, it } from "vitest";


const emailFromFormB: SelectedPrefill = {
    sourceId: "direct-dependencies",
    groupId: "node-b",
    groupLabel: "Form B",
    optionId: "email",
    optionLabel: "Email"
};

const wrapper = ({ children }: { children: ReactNode }) => (
    <PrefillProvider>{children}</PrefillProvider>
);

describe("PrefillProvider", () => {
    it("should set, read, clear selection", () => {
        const { result } = renderHook(
            () => ({
                state: usePrefillState(),
                field: useFieldPrefill("node-d", "email"),
                actions: usePrefillActions()
            }),
            { wrapper }
        );

        expect(result.current.field).toBeUndefined();

        act(() => result.current.actions.setPrefill("node-d", "email", emailFromFormB));
        expect(result.current.field).toEqual(emailFromFormB);
        expect(result.current.state).toEqual({ "node-d": { email: emailFromFormB } });

        act(() => result.current.actions.clearPrefill("node-d", "email"));
        expect(result.current.field).toBeUndefined();
    });

    it("usePrefillState throws a helpful error outside the provider", () => {
        expect(() => renderHook(() => usePrefillState())).toThrow("PrefillProvider")
    })

    it("usePrefillDispatch-based hooks throw outside the provider", () => {
        expect(() => renderHook(() => usePrefillActions())).toThrow("PrefillProvider")
    })
})
