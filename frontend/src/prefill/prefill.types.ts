export interface SelectedPrefill {
    sourceId: string;
    groupId: string;
    groupLabel: string;
    optionId: string;
    optionLabel: string;
}

export function formatPrefillDisplay(selection: SelectedPrefill): string {
    return `${selection.groupLabel}.${selection.optionLabel}`
}