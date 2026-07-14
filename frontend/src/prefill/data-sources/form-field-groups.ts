import type { GraphNode } from "@/api/graph.types";
import type { FormGraph } from "@/domain/form-graph";
import type { PrefillSourceGroup } from "./types";

// Map upstream for nodes to prefill groups - one group per node
// Labeled with forms name, offering that forms fields as options
export function groupsFromNodes(
    graph: FormGraph,
    nodes: GraphNode[]
): PrefillSourceGroup[] {
    return nodes.map((node) => ({
        id: node.id,
        label: node.data.name,
        options: graph.getFieldsForNode(node.id).map((field) => ({
            id: field.id,
            label: field.label
        })),
    })).filter((group) => group.options.length > 0); //Nodes whose form has no fields are dropped.
}

