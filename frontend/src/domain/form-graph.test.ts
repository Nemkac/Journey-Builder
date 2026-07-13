import type { ActionBluepringGraphResponse, GraphNode } from "@/api/graph.types"
import graphFixture from "@/test/fixtures/graph.json";
import { FormGraph } from "./form-graph";
import { describe, expect, it } from "vitest";

const response = graphFixture as ActionBluepringGraphResponse;
const graph = new FormGraph(response);

function nodeId(name: string): string {
    const node = response.nodes.find((node) => node.data.name === name);
    if (!node) throw new Error(`No node names: "${name} in fixture`);

    return node.id;
};

const names = (nodes: GraphNode[]) => nodes.map((node) => node.data.name);

describe("FormGraph.getFieldsByNode", () => {
    it("resolves fields through component_id to forms entry", () => {
        const fields = graph.getFieldsForNode(nodeId("Form A"));
        expect(fields.map((field) => field.id)).toContain("email");
        expect(fields).toHaveLength(8);
    })

    it("uses the schema title as label", () => {
        const fields = graph.getFieldsForNode(nodeId("Form A"));
        expect(fields.find((field) => field.id === "email")?.label).toBe("Email");
    })

    it("falls back to the property key when the schema has no title", () => {
        const fields = graph.getFieldsForNode(nodeId("Form A"));
        const checkboxGroup = fields.find((field) => field.id === "dynamic_checkbox_group");
        expect(checkboxGroup?.label).toBe("dynamic_checkbox_group");
    })

    it("returns [] for an unknown node id", () => {
        expect(graph.getFieldsForNode("nope")).toEqual([])
    });
});

describe("FormGraph.getDirectParents", () => {
    it("Form D direct parent is B", () => {
        expect(names(graph.getDirectParents(nodeId("Form D")))).toEqual(["Form B"]);
    });

    it("Form F direct parents are D and E", () => {
        expect(names(graph.getDirectParents(nodeId("Form F")))).toEqual(["Form D", "Form E"]);
    });

    it("a root node (Form A) has no parents", () => {
        expect(graph.getDirectParents(nodeId("Form A"))).toEqual([]);
    });
})

describe("FormGraph.getAncestors", () => {
    it("Form D ancestors are B and A", () => {
        expect(names(graph.getAncestors(nodeId("Form D"))).sort()).toEqual(["Form A", "Form B"]);
    })

    it("Form F ancestors are all five upsream forms, each once", () => {
        expect(names(graph.getAncestors(nodeId("Form F"))).sort()).toEqual(["Form A", "Form B", "Form C", "Form D", "Form E"]);
    })

    it("never includes the node itself", () => {
        expect(names(graph.getAncestors(nodeId("Form F")))).not.toContain("Form F");
    })
})

describe("FormGraph.getTransitiveOnlyParents", () => {
    it("Form D trasitive only parent is A", () => {
        expect(names(graph.getTransitiveOnlyParents(nodeId("Form D")))).toEqual(["Form A"]);
    });

    it("Form F trasitive only are A, B, C", () => {
        expect(names(graph.getTransitiveOnlyParents(nodeId("Form F"))).sort()).toEqual(["Form A", "Form B", "Form C"]);
    })

    it("A root nde has none", () => {
        expect(names(graph.getTransitiveOnlyParents(nodeId("Form A")))).toEqual([]);
    })
})


