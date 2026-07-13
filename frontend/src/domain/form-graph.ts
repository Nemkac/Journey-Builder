import type { ActionBluepringGraphResponse, GraphNode } from "@/api/graph.types";

export interface FormField {
    id: string;
    label: string;
    avantos_type: string;
}

export class FormGraph {
    private readonly nodesById: Map<string, GraphNode>;
    private readonly fieldsByFormId: Map<string, FormField[]>;

    constructor(response: ActionBluepringGraphResponse) {
        this.nodesById = new Map(response.nodes.map((node) => [node.id, node]));

        this.fieldsByFormId = new Map(
            response.forms.map((form) => [
                form.id,
                Object.entries(form.field_schema.properties).map(([key, prop]) => ({
                    id: key,
                    label: prop.title ?? key,
                    avantos_type: prop.avantos_type
                }))
            ])
        );
    }

    get nodes(): GraphNode[] {
        return [...this.nodesById.values()];
    }

    getNode(nodeId: string): GraphNode | undefined {
        return this.nodesById.get(nodeId);
    }

    getFieldsForNode(nodeId: string): FormField[] {
        const node = this.nodesById.get(nodeId);

        if (!node) return [];
        return this.fieldsByFormId.get(node.data.component_id) ?? [];
    };

    // Direct upstream dependencies
    getDirectParents(nodeId: string): GraphNode[] {
        const node = this.nodesById.get(nodeId);

        if (!node) return [];
        return node.data.prerequisites.map((id) => this.nodesById.get(id)).filter((parent): parent is GraphNode => parent !== undefined);
    }

    // Every upstream node reachable from nodeId
    getAncestors(nodeId: string): GraphNode[] {
        const start = this.nodesById.get(nodeId);
        if (!start) return [];

        const visited = new Set<string>([nodeId]);
        const ancestors: GraphNode[] = [];
        const queue = [...start.data.prerequisites];

        for (let i = 0; i < queue.length; i++) {
            const currentId = queue[i];
            if (visited.has(currentId)) continue;

            visited.add(currentId);

            const node = this.nodesById.get(currentId);
            if (!node) continue;

            ancestors.push(node);
            queue.push(...node.data.prerequisites);
        }

        return ancestors;
    }

    // Ancestors minus direct parents
    getTransitiveOnlyParents(nodeId: string): GraphNode[] {
        const node = this.nodesById.get(nodeId);
        if (!node) return [];

        const directIds = new Set(node.data.prerequisites);
        return this.getAncestors(nodeId).filter(
            (ancestor) => !directIds.has(ancestor.id)
        );
    }


}