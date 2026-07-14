import type { FormGraph } from "@/domain/form-graph";

export interface PrefillOption {
    id: string;
    label: string;
}

export interface PrefillSourceGroup {
    id: string;
    label: string;
    options: PrefillOption[];
}

export interface PrefillSourceContext {
    graph: FormGraph;
    targetNodeId: string;
}

export interface PrefillDataSource {
    id: string;
    label: string;
    getGroups(context: PrefillSourceContext): PrefillSourceGroup[];
}

