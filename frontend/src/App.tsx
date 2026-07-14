import { useState } from 'react'
import { PrefillProvider } from './prefill/prefill-context';
import { FormsList } from './components/graph/form-list';
import { PrefillPanel } from './components/prefill/prefill-panel';

function App() {
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);

  return (
    <PrefillProvider>
      <div className='mx-auto grid max-w-5xl grid-cols-[280px_1fr] gap-6 p-6'>
        <FormsList
          selectedNodeId={selectedNodeId}
          onSelectNode={setSelectedNodeId} />
        <div>
          {selectedNodeId ? (
            <PrefillPanel nodeId={selectedNodeId} />
          ) : (
            <p className='text-sm text-muted-foreground'>
              Select a form to continue its prefill mappings.
            </p>
          )}
        </div>
      </div>
    </PrefillProvider>
  )
}

export default App
