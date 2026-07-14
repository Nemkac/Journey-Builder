import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { FormsList } from "./form-list";
import userEvent from "@testing-library/user-event";
import { nodeIdByName } from "@/test/fixtures/fixture-graph";
import { mswServer } from "@/test/msw/server";
import { graphEndpoint } from "@/test/msw/handler";
import { http, HttpResponse } from "msw";

function renderFormsList() {
    const onSelectNode = vi.fn();
    const queryClient = new QueryClient({
        defaultOptions: { queries: { retry: false } }
    });

    render(
        <QueryClientProvider client={queryClient}>
            <FormsList selectedNodeId={null} onSelectNode={onSelectNode} />
        </QueryClientProvider>
    )

    return { onSelectNode }
};

describe("FormsList", () => {
    it("renders every from name after loading", async () => {
        renderFormsList();

        expect(await screen.findByText("Form A")).toBeInTheDocument();
        for (const name of ["Form B", "Form C", "Form D", "Form E", "Form F"]) {
            expect(screen.getByText(name)).toBeInTheDocument();
        }
    });

    it("reports the clicked nodes id", async () => {
        const user = userEvent.setup();
        const { onSelectNode } = renderFormsList();

        await user.click(await screen.findByRole("button", { name: "Form D" }));

        expect(onSelectNode).toHaveBeenCalledWith(nodeIdByName("Form D"));
    });

    it("shows an error message when the request fails", async () => {
        mswServer.use(
            http.get(graphEndpoint, () =>
                HttpResponse.json({ error: "Error" }, { status: 500 })),
        );

        renderFormsList();

        expect(await screen.findByRole("alert")).toHaveTextContent("Failed to load forms");
    });
});