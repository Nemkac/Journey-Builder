import type { PrefillDataSource, PrefillSourceGroup } from "./types";

const GLOBAL_GROUPS: PrefillSourceGroup[] = [
    {
        id: "action-properties",
        label: "Action Properties",
        options: [
            { id: "action_id", label: "Action ID" },
            { id: "action_name", label: "Action Name" },
            { id: "action_category", label: "Action Category" }
        ],
    },
    {
        id: "client-organization-properties",
        label: "Client Organization Properties",
        options: [
            { id: "org_id", label: "Organization ID" },
            { id: "org_name", label: "Organization Name" },
            { id: "org_email", label: "Organization Email" }
        ]
    }
];

export const globalDataSource: PrefillDataSource = {
    id: "global-data",
    label: "Global Data",
    getGroups: () => GLOBAL_GROUPS
};

