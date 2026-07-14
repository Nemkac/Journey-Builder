import type { PrefillSourceGroup } from "./data-sources/types";

export function filterGroups(
    groups: PrefillSourceGroup[],
    query: string
): PrefillSourceGroup[] {
    const parsedQuery = query.trim().toLowerCase();

    if (parsedQuery === "") return groups;

    return groups.map((group) => {
        if (group.label.toLowerCase().includes(parsedQuery)) return group;
        return {
            ...group,
            options: group.options.filter((option) => option.label.toLowerCase().includes(parsedQuery)),
        }
    }).filter((group) => group.options.length > 0)
}