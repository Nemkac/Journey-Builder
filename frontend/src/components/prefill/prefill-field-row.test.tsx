import type { FormField } from "@/domain/form-graph";
import { PrefillProvider } from "@/prefill/prefill-context";
import type { PrefillState } from "@/prefill/prefill-reducer";
import type { SelectedPrefill } from "@/prefill/prefill.types";
import { describe, expect, it, vi } from "vitest";
import { PrefillFieldRow } from "./prefill-field-row";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

const emailField: FormField = {
    id: "email",
    label: "Email",
    avantos_type: "short-text"
};

const emailFromFormB: SelectedPrefill = {
    sourceId: "direct-dependencies",
    groupId: "node-b",
    groupLabel: "Form B",
    optionId: "email",
    optionLabel: "Email"
};

const mappedState: PrefillState = {
    "node-d": { email: emailFromFormB }
};

function renderRow(initialState: PrefillState = {}) {
    const onRequestPrefill = vi.fn();
    render(
        <PrefillProvider initialState={initialState}>
            <PrefillFieldRow
                nodeId="node-d"
                field={emailField}
                onRequestPrefill={onRequestPrefill}
            />
        </PrefillProvider>
    );

    return { onRequestPrefill }
}

describe("PrefillFieldRow", () => {
    it("unmapped - shows empty affordance and reports clicks", async () => {
        const user = userEvent.setup();
        const { onRequestPrefill } = renderRow();

        expect(screen.getByText("Email")).toBeInTheDocument();

        await user.click(screen.getByRole("button", { name: /set prefill/i }));
        expect(onRequestPrefill).toHaveBeenCalledWith("email");
    });

    it("mapped - shows the mapping instead of empty affordance", () => {
        renderRow(mappedState);

        expect(screen.getByText("Form B.Email")).toBeInTheDocument();
        expect(screen.queryByText("Set prefill")).not.toBeInTheDocument();
    })

    it("clicking the clear button removes the mapping", async () => {
        const user = userEvent.setup();
        renderRow(mappedState);

        await user.click(
            screen.getByRole("button", { name: "Clear prefill for Email" })
        );

        expect(screen.queryByText("Form B.Email")).not.toBeInTheDocument();
        expect(screen.getByText("Set prefill")).toBeInTheDocument();
    })
})


