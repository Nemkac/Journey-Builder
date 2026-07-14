import type { FormField } from "@/domain/form-graph";
import type { PrefillDataSource } from "@/prefill/data-sources/types";
import { PrefillProvider, useFieldPrefill } from "@/prefill/prefill-context";
import { formatPrefillDisplay } from "@/prefill/prefill.types";
import { nodeIdByName } from "@/test/fixtures/fixture-graph";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { DataElementModal } from "./data-element-modal";
import { prefillDataSources } from "@/prefill/data-sources/registry";
import userEvent from "@testing-library/user-event";

const emailField: FormField = {
    id: "email",
    label: "Email",
    avantos_type: "short-text"
};

function Mapping({ nodeId, fieldId }: { nodeId: string, fieldId: string }) {
    const selection = useFieldPrefill(nodeId, fieldId);
    return <p data-testid="mapping">
        {selection ? formatPrefillDisplay(selection) : "unmapped"}
    </p>
}

function renderModal(sources?: readonly PrefillDataSource[]) {
    const onClose = vi.fn();
    const nodeId = nodeIdByName("Form D");
    const queryClient = new QueryClient({
        defaultOptions: { queries: { retry: false } }
    });

    render(
        <QueryClientProvider client={queryClient}>
            <PrefillProvider>
                <DataElementModal
                    nodeId={nodeId}
                    field={emailField}
                    onClose={onClose}
                    sources={sources}
                />
                <Mapping nodeId={nodeId} fieldId="email" />
            </PrefillProvider>
        </QueryClientProvider>
    )

    return { onClose }
}

describe("DataElementModal", () => {
    it("renders one section per registered source", async () => {
        renderModal();

        for (const source of prefillDataSources) {
            expect(await screen.findByText(source.label)).toBeInTheDocument();
        }
    });

    it("renders an injected source it has never heard of", async () => {
        const fakeSource: PrefillDataSource = {
            id: "fake-source",
            label: "Fake Source",
            getGroups: () => [
                {
                    id: "fake-group",
                    label: "Fake Group",
                    options: [{ id: "fake-option", label: "Fake Option" }],
                },
            ],
        };
        const user = userEvent.setup();
        renderModal([fakeSource]);

        expect(await screen.findByText("Fake Source")).toBeInTheDocument();
        expect(screen.queryByText("Direct dependencies")).not.toBeInTheDocument();

        await user.click(screen.getByRole("button", { name: "Fake Group" }));
        expect(screen.getByRole("button", { name: "Fake Option" })).toBeInTheDocument();
    });

    it("search shows matching options across all sources", async () => {
        const user = userEvent.setup();
        renderModal();

        await user.type(
            await screen.findByPlaceholderText(/search/i),
            "email",
        );

        expect(screen.getAllByRole("button", { name: "Email" })).toHaveLength(2);
        expect(screen.getByRole("button", { name: "Organization Email" })).toBeInTheDocument();
        expect(screen.queryByText("Action Name")).not.toBeInTheDocument();
    });

    it("selecting an option stores the mapping and closes", async () => {
        const user = userEvent.setup();
        const { onClose } = renderModal();

        await user.click(await screen.findByRole("button", { name: "Form B" }));
        await user.click(screen.getByRole("button", { name: "Email" }));

        expect(screen.getByTestId("mapping")).toHaveTextContent("Form B.Email");
        expect(onClose).toHaveBeenCalledTimes(1);
    });
});