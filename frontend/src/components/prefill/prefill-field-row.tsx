import type { FormField } from "@/domain/form-graph";
import { useFieldPrefill, usePrefillActions } from "@/prefill/prefill-context";
import { formatPrefillDisplay } from "@/prefill/prefill.types";
import { X } from "lucide-react";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";

interface PrefillFieldRowProps {
    nodeId: string;
    field: FormField;
    onRequestPrefill: (fieldId: string) => void;
}

export function PrefillFieldRow({ nodeId, field, onRequestPrefill }: PrefillFieldRowProps) {
    const selection = useFieldPrefill(nodeId, field.id);
    const { clearPrefill } = usePrefillActions();

    if (!selection) {
        return (
            <button
                type="button"
                onClick={() => onRequestPrefill(field.id)}
                className="flex w-full items-center justify-between rounded-md border border-dashed px-3 py-2 text-left text-sm text-muted-foreground hover:border-primary hover:bg-accent"
            >
                <span>{field.label}</span>
                <span className="text-xs">Set prefill</span>
            </button>
        );
    }

    return (
        <div className="flex w-full items-center justify-between rounded-md border px-3 py-2 text-sm">
            <span>{field.label}</span>
            <span className="flex items-center gap-2">
                <Badge variant="secondary">{formatPrefillDisplay(selection)}</Badge>
                <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    aria-label={`Clear prefill for ${field.label}`}
                    onClick={() => clearPrefill(nodeId, field.id)}
                >
                    <X className="size-4" />
                </Button>
            </span>
        </div>
    )
}