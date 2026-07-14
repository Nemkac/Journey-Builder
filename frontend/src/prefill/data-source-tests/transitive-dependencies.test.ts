import { fixtureGraph, nodeIdByName } from "@/test/fixtures/fixture-graph";
import { transitiveDependenciesSource } from "../data-sources/transitive-dependencies";
import { describe, expect, it } from "vitest";

const groupsFor = (name: string) =>
    transitiveDependenciesSource.getGroups({
        graph: fixtureGraph,
        targetNodeId: nodeIdByName(name)
    });

describe("transitiveDependenciesSource", () => {
    it("Form F makes group per direct parents A, B, C", () => {
        expect(groupsFor("Form F").map((group) => group.label).sort()).toEqual(["Form A", "Form B", "Form C"]);
    });

    it("Form D makes only group for A", () => {
        expect(groupsFor("Form D").map((group) => group.label)).toEqual(["Form A"]);
    });

    it("a root node makes no groups", () => {
        expect(groupsFor("Form A")).toEqual([]);
    });
});