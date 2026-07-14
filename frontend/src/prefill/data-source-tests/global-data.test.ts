import { fixtureGraph, nodeIdByName } from "@/test/fixtures/fixture-graph"
import { describe, expect, it } from "vitest"
import { globalDataSource } from "../data-sources/global-data";

describe("globalDataSource", () => {
    it("Makes same static groups regardless of the target node", () => {
        const context = (name: string) => ({
            graph: fixtureGraph,
            targetNodeId: nodeIdByName(name)
        });

        expect(globalDataSource.getGroups(context("Form A"))).toEqual(globalDataSource.getGroups(context("Form F")));
    });

    it("exposes Action and Client Organization property groups", () => {
        const groups = globalDataSource.getGroups({
            graph: fixtureGraph,
            targetNodeId: nodeIdByName("Form A")
        });

        expect(groups.map((group) => group.label)).toEqual([
            "Action Properties",
            "Client Organization Properties"
        ]);

        for (const group of groups) {
            expect(group.options.length).toBeGreaterThan(0);
        }
    });
});

