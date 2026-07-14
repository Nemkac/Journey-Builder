import { queryOptions } from "@tanstack/react-query"
import { fetchActionBlueprintGraph } from "./queries"
import { FormGraph } from "@/domain/form-graph"

export const graphQueryKeys = {
    all: ["action-bluepring-graph"] as const,
    details: (tenantId: string, blueprintId: string) => [...graphQueryKeys.all, "details", tenantId, blueprintId] as const
}

export function allGraphQueries(): {
    predicate: (query: { queryKey: Array<string> }) => boolean
} {
    return {
        predicate: ({ queryKey }) => queryKey[0] === graphQueryKeys.all[0]
    }
};

export const graphQueries = {
    details: (tenantId: string, blueprintId: string) =>
        queryOptions({
            queryKey: graphQueryKeys.details(tenantId, blueprintId),
            queryFn: () => fetchActionBlueprintGraph(tenantId, blueprintId),
            select: (response) => new FormGraph(response),
            staleTime: Infinity
        })
}