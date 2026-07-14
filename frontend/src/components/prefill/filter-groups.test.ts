import type { PrefillSourceGroup } from "@/prefill/data-sources/types";
import { filterGroups } from "@/prefill/filter-groups";
import { describe, expect, it } from "vitest";

const groups: PrefillSourceGroup[] = [
    {
        id: "node-b",
        label: "Form B",
        options: [
            { id: "email", label: "Email" },
            { id: "name", label: "Name" }
        ],
    },
    {
        id: "action-properties",
        label: "Action Properties",
        options: [
            { id: "action_name", label: "Action Name" }
        ]
    }
]

describe("filterGroups", () => {
    it("returns the groups untouched for empty whitespace query", () => {
        expect(filterGroups(groups, "")).toBe(groups);
        expect(filterGroups(groups, " ")).toBe(groups);
    });

    it("matches option labels case-insensitively", () => {
        const result = filterGroups(groups, "EMAIL");
        expect(result).toHaveLength(1);
        expect(result[0].options.map((option) => option.label)).toEqual(["Email"]);
    });

    it("keeps every option of a group whose label matches", () => {
        const result = filterGroups(groups, "form b");
        expect(result).toHaveLength(1);
        expect(result[0].options).toHaveLength(2);
    });

    it("drops groups left with no matching options", () => {
        const result = filterGroups(groups, "email");
        expect(result.map((group) => group.label)).toEqual(["Form B"])
    });

    it("substring-matches across groups", () => {
        const result = filterGroups(groups, "name");
        expect(result.map((group) => group.label)).toEqual(["Form B", "Action Properties"]);
    });
})