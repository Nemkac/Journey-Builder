import type { FormGraph } from "@/domain/form-graph";
import type { Edge, Node } from "@xyflow/react";

export type FormNodeData = {
    label: string;
    isSelected: boolean;
}

export type FormFlowNode = Node<FormNodeData, "form">

export function toFlowGraph(
    graph: FormGraph,
    selectedNodeId: string | null
): { nodes: FormFlowNode[]; edges: Edge[] } {
    const nodes: FormFlowNode[] = graph.nodes.map((node) => ({
        id: node.id,
        type: "form",
        position: node.position,
        data: {
            label: node.data.name,
            isSelected: node.id === selectedNodeId
        }
    }));

    const edges: Edge[] = graph.nodes.flatMap((node) =>
        node.data.prerequisites.map((parentId) => ({
            id: `${parentId}->${node.id}`,
            source: parentId,
            target: node.id,
        })),
    );

    return { nodes, edges };
}