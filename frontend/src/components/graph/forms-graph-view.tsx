import { useMemo } from "react";
import { Background, Controls, ReactFlow } from "@xyflow/react";
import type { NodeTypes } from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import { useActionBlueprintGraph } from "@/api/use-action-blueprint-graph";
import { Skeleton } from "../ui/skeleton";
import { toFlowGraph } from "./flow-mapping";
import { FormNode } from "./form-node";

const nodeTypes: NodeTypes = { form: FormNode };

interface FormsGraphViewProps {
    selectedNodeId: string | null;
    onSelectNode: (nodeId: string) => void;
}

export function FormsGraphView({ selectedNodeId, onSelectNode }: FormsGraphViewProps) {
    const { data: graph, isPending, isError, error } = useActionBlueprintGraph();

    const flow = useMemo(
        () => (graph ? toFlowGraph(graph, selectedNodeId) : null),
        [graph, selectedNodeId],
    );

    if (isPending) {
        return <Skeleton className="h-120 w-full" />;
    }

    if (isError) {
        return (
            <p role="alert" className="text-sm text-destructive">
                Failed to load graph: {error.message}
            </p>
        );
    }

    if (!flow) return null;

    return (
        <div className="h-120 rounded-md border">
            <ReactFlow
                nodes={flow.nodes}
                edges={flow.edges}
                nodeTypes={nodeTypes}
                onNodeClick={(_, node) => onSelectNode(node.id)}
                nodesDraggable={false}
                nodesConnectable={false}
                elementsSelectable={false}
                fitView
            >
                <Background />
                <Controls showInteractive={false} />
            </ReactFlow>
        </div>
    );
}
