import { describe, expect, it } from "vitest";
import { prefillDataSources } from "../data-sources/registry";
import { fixtureGraph, nodeIdByName } from "@/test/fixtures/fixture-graph";

describe("prefillDataSource registry", () => {
    it("registers all sources with unique ids, in display order", () => {
        const ids = prefillDataSources.map((source) => source.id);
        expect(ids).toEqual([
            "direct-dependencies",
            "transitive-dependencies",
            "global-data"
        ]);
        expect(new Set(ids).size).toBe(ids.length);
    });

    it("a registry walk for Form F makes every expected group exactly once", () => {
        const context = {
            graph: fixtureGraph,
            targetNodeId: nodeIdByName("Form F")
        };
        const labels = prefillDataSources.flatMap((source) => source.getGroups(context).map((group) => group.label));
        expect([...labels].sort()).toEqual([
            "Action Properties",
            "Client Organization Properties",
            "Form A",
            "Form B",
            "Form C",
            "Form D",
            "Form E",
        ]);
    });
})