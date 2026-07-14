import { useActionBlueprintGraph } from "@/api/use-action-blueprint-graph";
import { useState } from "react";
import { Skeleton } from "../ui/skeleton";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card";
import { PrefillFieldRow } from "./prefill-field-row";

interface PrefillPanelProps {
    nodeId: string;
}

export function PrefillPanel({ nodeId }: PrefillPanelProps) {
    const { data: graph, isPending, isError, error } = useActionBlueprintGraph();

    const [activeFieldId, setActiveFieldId] = useState<string | null>(null);

    if (isPending) {
        return <Skeleton className="h-64 w-full" />
    }

    if (isError) {
        return (
            <p role="alert" className="text-sm text-destructive">
                Failed to load form details: {error.message}
            </p>
        )
    }

    const node = graph.getNode(nodeId);
    const fields = graph.getFieldsForNode(nodeId);

    return (
        <Card>
            <CardHeader>
                <CardTitle>{node?.data.name ?? "Unknown form"}</CardTitle>
                <CardDescription>
                    Choose where each field gets its value from
                </CardDescription>
            </CardHeader>
            <CardContent>
                {fields.length === 0 ? (
                    <p className="text-sm text-muted-foreground">
                        This form has no fields
                    </p>
                )
                    : (
                        <ul className="flex flex-col gap-2">
                            {fields.map((field) => (
                                <li key={field.id}>
                                    <PrefillFieldRow
                                        nodeId={nodeId}
                                        field={field}
                                        onRequestPrefill={setActiveFieldId}
                                    />
                                </li>
                            ))}
                        </ul>
                    )}
                {activeFieldId !== null && (
                    <p className="mt-3 text-xs text-muted-foreground">
                        Data source picker for "{activeFieldId}" arrives in next phase
                    </p>
                )}
            </CardContent>
        </Card>
    )
}