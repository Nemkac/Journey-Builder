import { groupsFromNodes } from "./form-field-groups";
import type { PrefillDataSource } from "./types";

export const directDependenciesSource: PrefillDataSource = {
    id: "direct-dependencies",
    label: "Direct dependencies",
    getGroups: ({ graph, targetNodeId }) => groupsFromNodes(graph, graph.getDirectParents(targetNodeId)),
};

