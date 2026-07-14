import { DEFAULT_BLUEPRINT_ID, DEFAULT_TENANT_ID, fetchActionBlueprintGraph } from "./queries";
import { useQuery } from "@tanstack/react-query";
import type { ActionBluepringGraphResponse } from "./graph.types";
import { FormGraph } from "@/domain/form-graph";

export function useActionBlueprintGraph(
    tenantId: string = DEFAULT_TENANT_ID,
    blueprintId: string = DEFAULT_BLUEPRINT_ID
) {
    return useQuery({
        queryKey: ["action-blueprint-graph", tenantId, blueprintId],
        queryFn: () => fetchActionBlueprintGraph(tenantId, blueprintId),
        select: (response: ActionBluepringGraphResponse) => new FormGraph(response),
        staleTime: Infinity
    })
}