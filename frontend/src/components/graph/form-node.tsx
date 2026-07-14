import { Handle, Position } from "@xyflow/react";
import type { NodeProps } from "@xyflow/react";
import { cn } from "@/lib/utils";
import type { FormFlowNode } from "./flow-mapping";

export function FormNode({ data }: NodeProps<FormFlowNode>) {
    return (
        <div
            className={cn(
                "rounded-md border bg-card px-4 py-2 text-sm shadow-sm",
                data.isSelected && "border-primary ring-2 ring-primary/40",
            )}
        >
            <Handle type="target" position={Position.Left} className="opacity-0" />
            {data.label}
            <Handle type="source" position={Position.Right} className="opacity-0" />
        </div>
    );
}