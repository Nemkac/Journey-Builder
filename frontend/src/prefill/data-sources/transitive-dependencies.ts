import { groupsFromNodes } from "./form-field-groups";
import type { PrefillDataSource } from "./types";

export const transitiveDependenciesSource: PrefillDataSource = {
    id: "transitive-dependencies",
    label: "Trasitive dependencies",
    getGroups: ({ graph, targetNodeId }) => groupsFromNodes(graph, graph.getTransitiveOnlyParents(targetNodeId))
};

