import { PrefillProvider } from "@/prefill/prefill-context";
import type { PrefillState } from "@/prefill/prefill-reducer";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { render, screen } from "@testing-library/react";
import { PrefillPanel } from "./prefill-panel";
import { describe, expect, it } from "vitest";
import { nodeIdByName } from "@/test/fixtures/fixture-graph";
import userEvent from "@testing-library/user-event";

function renderPanel(nodeId: string, initialState: PrefillState = {}) {
    const queryClient = new QueryClient({
        defaultOptions: { queries: { retry: false } }
    });
    render(
        <QueryClientProvider client={queryClient}>
            <PrefillProvider initialState={initialState}>
                <PrefillPanel nodeId={nodeId} />
            </PrefillProvider>
        </QueryClientProvider>
    );
}

describe("PrefillPanel", () => {
    it("renders the form name and one row per field", async () => {
        renderPanel(nodeIdByName("Form D"));

        expect(await screen.findByText("Form D")).toBeInTheDocument();

        for (const label of ["Button", "dynamic_checkbox_group", "Dynamic Object", "Email", "ID", "multi_select", "Name", "Notes"]) {
            expect(screen.getByText(label)).toBeInTheDocument();
        }
    })

    it("shows seeded mapping on its row", async () => {
        renderPanel(nodeIdByName("Form D"), {
            [nodeIdByName("Form D")]: {
                email: {
                    sourceId: "direct-dependencies",
                    groupId: nodeIdByName("Form B"),
                    groupLabel: "Form B",
                    optionId: "email",
                    optionLabel: "Email"
                }
            }
        });

        expect(await screen.findByText("Form B.Email")).toBeInTheDocument();
    });

    it("records which field requested a prefill", async () => {
        const user = userEvent.setup();

        renderPanel(nodeIdByName("Form D"));

        await user.click(
            await screen.findByRole("button", { name: /Email.*Set prefill/ }),
        );

        expect(screen.getByText(/picker for "email"/)).toBeInTheDocument();
    })

    it("renders gracefully for unknown node id", async () => {
        renderPanel("no-such-node");

        expect(await screen.findByText("Unknown form")).toBeInTheDocument();
        expect(screen.getByText("This form has no fields")).toBeInTheDocument();
    })
})