import { useState } from "react";
import { FormsGraphView } from "@/components/graph/forms-graph-view";
import { FormsList } from "@/components/graph/form-list";
import { PrefillPanel } from "@/components/prefill/prefill-panel";
import { Button } from "@/components/ui/button";
import { PrefillProvider } from "@/prefill/prefill-context";

type ViewMode = "list" | "graph";

function App() {
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<ViewMode>("list");

  return (
    <PrefillProvider>
      <main className="mx-auto flex max-w-6xl flex-col gap-6 p-6">
        <div className="flex items-end justify-between">
          <div>
            <h1 className="text-xl font-semibold">Journey Builder</h1>
            <p className="text-sm text-muted-foreground">
              Configure prefill mappings across the form graph.
            </p>
          </div>
          <div className="flex gap-1">
            <Button
              size="sm"
              variant={viewMode === "list" ? "default" : "outline"}
              aria-pressed={viewMode === "list"}
              onClick={() => setViewMode("list")}
            >
              List
            </Button>
            <Button
              size="sm"
              variant={viewMode === "graph" ? "default" : "outline"}
              aria-pressed={viewMode === "graph"}
              onClick={() => setViewMode("graph")}
            >
              Graph
            </Button>
          </div>
        </div>
        <div className="grid grid-cols-1 items-start gap-6 md:grid-cols-[1fr_360px]">
          {viewMode === "list" ? (
            <FormsList
              selectedNodeId={selectedNodeId}
              onSelectNode={setSelectedNodeId}
            />
          ) : (
            <FormsGraphView
              selectedNodeId={selectedNodeId}
              onSelectNode={setSelectedNodeId}
            />
          )}
          <div>
            {selectedNodeId ? (
              <PrefillPanel nodeId={selectedNodeId} />
            ) : (
              <div className="flex min-h-50 items-center justify-center rounded-md border border-dashed">
                <p className="text-sm text-muted-foreground">
                  Select a form to configure its prefill mappings.
                </p>
              </div>
            )}
          </div>
        </div>
      </main>
    </PrefillProvider>
  );
}

export default App;
