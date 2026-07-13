import { fixtureGraph, nodeIdByName } from "@/test/fixtures/fixture-graph";
import { directDependenciesSource } from "../data-sources/direct-dependencies";
import { describe, expect, it } from "vitest";

const groupsFor = (name: string) =>
    directDependenciesSource.getGroups({
        graph: fixtureGraph,
        targetNodeId: nodeIdByName(name)
    });

describe("directDependenciesSource", () => {
    it("Form F makes group per direct parents D and E", () => {
        expect(groupsFor("Form F").map((group) => group.label).sort()).toEqual(["Form D", "Form E"]);
    });

    it("each group offers the parent form fields as options", () => {
        for (const group of groupsFor("Form F")) {
            expect(group.options).toHaveLength(8);
            expect(group.options.map((option) => option.id)).toContain("email");
        }
    });

    it("Form D makes group only from its direct parent B", () => {
        expect(groupsFor("Form D").map((group) => group.label)).toEqual(["Form B"]);
    });

    it("a root node make no groups", () => {
        expect(groupsFor("Form A")).toEqual([])
    });

    it("group ids are the upstream node ids", () => {
        expect(groupsFor("Form D")[0].id).toBe(nodeIdByName("Form B"));
    });
})
