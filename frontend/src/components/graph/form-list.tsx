import { useActionBlueprintGraph } from "@/api/use-action-blueprint-graph";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { cn } from "@/lib/utils";
import { Skeleton } from "../ui/skeleton";

interface FormListProps {
    selectedNodeId: string | null
    onSelectNode: (nodeId: string) => void;
}

export function FormsList({ selectedNodeId, onSelectNode }: FormListProps) {
    const { data: graph, isPending, isError, error } = useActionBlueprintGraph();

    return (
        <Card>
            <CardHeader>
                <CardTitle>Forms</CardTitle>
            </CardHeader>
            <CardContent>
                {isPending && <FormListSkeleton />}
                {isError && (
                    <p role="alert" className="text-sm text-destructive">
                        Failed to load forms: {error.message}
                    </p>
                )}
                {graph && (
                    <ul className="flex flex-col gap-2">
                        {[...graph.nodes]
                            .sort((a, b) => a.data.name.localeCompare(b.data.name))
                            .map((node) => (
                                <li key={node.id}>
                                    <button onClick={() => onSelectNode(node.id)}
                                        className={cn(
                                            "w-full rounded-md px-3 py-2 text-sm hover:bg-accent",
                                            node.id === selectedNodeId && "bg-accent font-medium"
                                        )}>
                                        {node.data.name}
                                    </button>
                                </li>
                            ))
                        }
                    </ul>
                )}
            </CardContent>
        </Card>
    )
}

function FormListSkeleton() {
    return (
        <div className="flex flex-col gap-2">
            {Array.from({ length: 6 }, (_, i) => (
                <Skeleton key={i} className="h-9 w-full" />
            ))}
        </div>
    )
}