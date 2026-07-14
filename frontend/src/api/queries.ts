import type { ActionBluepringGraphResponse } from "./graph.types";

export const DEFAULT_TENANT_ID = "1";
export const DEFAULT_BLUEPRINT_ID = "bp_01jk766tckfwx84xjcxazggzyc"

export async function fetchActionBlueprintGraph(
    tenantId: string = DEFAULT_TENANT_ID,
    blueprintId: string = DEFAULT_BLUEPRINT_ID
): Promise<ActionBluepringGraphResponse> {
    const response = await fetch(
        `/api/v1/${tenantId}/actions/blueprints/${blueprintId}/graph`,
    );

    if (!response.ok) {
        throw new Error(
            `Failed to fetch blueprint graph (${response.status} ${response.statusText})`,
        );
    }

    return response.json() as Promise<ActionBluepringGraphResponse>;
}