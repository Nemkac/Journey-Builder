import { useState } from 'react'
import { PrefillProvider } from './prefill/prefill-context';
import { FormsList } from './components/graph/form-list';

function App() {

  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);

  return (
    <PrefillProvider>
      <div className='mx-auto grid max-w-5xl grid-cols-[280px_1fr] gap-6 p-6'>
        <FormsList
          selectedNodeId={selectedNodeId}
          onSelectNode={setSelectedNodeId} />
        <div>
          Prefill pannel
        </div>
      </div>
    </PrefillProvider>
  )
}

export default App
