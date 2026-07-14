import { useActionBlueprintGraph } from "@/api/use-action-blueprint-graph";
import type { FormField } from "@/domain/form-graph";
import { prefillDataSources } from "@/prefill/data-sources/registry";
import type { PrefillDataSource } from "@/prefill/data-sources/types";
import { usePrefillActions } from "@/prefill/prefill-context";
import { useMemo, useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "../ui/dialog";
import { Input } from "../ui/input";
import { filterGroups } from "@/prefill/filter-groups";
import { DataSourceGroup } from "./data-source-group";

interface DataElementModalProps {
    nodeId: string;
    field: FormField;
    onClose: () => void;
    sources?: readonly PrefillDataSource[];
}

export function DataElementModal({
    nodeId,
    field,
    onClose,
    sources = prefillDataSources,
}: DataElementModalProps) {
    const { data: graph } = useActionBlueprintGraph();
    const { setPrefill } = usePrefillActions();
    const [query, setQuery] = useState("");

    const sections = useMemo(() => {
        if (!graph) return []

        const context = { graph, targetNodeId: nodeId };
        return sources.map((source) => ({
            source,
            groups: source.getGroups(context),
        }));
    }, [graph, nodeId, sources]);

    return (
        <Dialog open onOpenChange={(open) => !open && onClose()}>
            <DialogContent className="max-h-[80vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>Prefill "{field.label}"</DialogTitle>
                    <DialogDescription>
                        Choose data element this field should be prefilled from
                    </DialogDescription>
                </DialogHeader>
                <Input
                    placeholder="Search data elements"
                    value={query}
                    onChange={(event) => setQuery(event.target.value)}
                />
                {sections.map(({ source, groups }) => {
                    const visibleGroups = filterGroups(groups, query);
                    if (visibleGroups.length === 0) return null;

                    return (
                        <div key={source.id}>
                            <p className="mb-1 text-xs font-semibold uppercase text-muted-foreground">
                                {source.label}
                            </p>
                            <div className="flex flex-col gap-2">
                                {visibleGroups.map((group) => (
                                    <DataSourceGroup
                                        key={group.id}
                                        group={group}
                                        forceOpen={query.trim() !== ""}
                                        onSelectOption={(option) => {
                                            setPrefill(nodeId, field.id, {
                                                sourceId: source.id,
                                                groupId: group.id,
                                                groupLabel: group.label,
                                                optionId: option.id,
                                                optionLabel: option.label
                                            });
                                            onClose();
                                        }}
                                    />
                                ))}
                            </div>
                        </div>
                    )
                })}
            </DialogContent>
        </Dialog>
    )
}