import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { renderHook, waitFor } from "@testing-library/react";
import type { ReactNode } from "react";
import { describe, expect, it } from "vitest";
import { useActionBlueprintGraph } from "./use-action-blueprint-graph";
import { FormGraph } from "@/domain/form-graph";
import { mswServer } from "@/test/msw/server";
import { http, HttpResponse } from "msw";
import { graphEndpoint } from "@/test/msw/handler";

function createWrapper() {
    const queryClient = new QueryClient({
        defaultOptions: { queries: { retry: false } }
    });
    return ({ children }: { children: ReactNode }) => (
        <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    )
}

describe("useActionBlueprintGraph", () => {
    it("fetches the graph and exposes it as a FormGraph", async () => {
        const { result } = renderHook(() => useActionBlueprintGraph(), {
            wrapper: createWrapper()
        });

        await waitFor(() => expect(result.current.isSuccess).toBe(true));

        expect(result.current.data).toBeInstanceOf(FormGraph);
        expect(result.current.data?.nodes).toHaveLength(6);
    })

    it("reports an error when the server fails", async () => {
        mswServer.use(
            http.get(graphEndpoint, () =>
                HttpResponse.json({ error: "Error" }, { status: 500 }))
        )

        const { result } = renderHook(() => useActionBlueprintGraph(), {
            wrapper: createWrapper()
        })

        await waitFor(() => expect(result.current.isError).toBe(true));
        expect(result.current.error?.message).toContain("500");
    });
});