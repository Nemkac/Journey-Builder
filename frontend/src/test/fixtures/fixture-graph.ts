import type { ActionBluepringGraphResponse } from "@/api/graph.types";
import graphFixture from "./graph.json";
import { FormGraph } from "@/domain/form-graph";

export const fixtureResponse = graphFixture as ActionBluepringGraphResponse;

export const fixtureGraph = new FormGraph(fixtureResponse);

export function nodeIdByName(name: string): string {
    const node = fixtureResponse.nodes.find((node) => node.data.name === name);
    if (!node) throw new Error(`No node named ${name} in fixutres`);
    return node.id
}