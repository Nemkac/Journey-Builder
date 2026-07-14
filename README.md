# Journey Builder

A React app that loads an action blueprint graph (a DAG of forms) from a mock server, shows the forms as a list or as an interactive graph, and lets you configure prefill mappings for the fields of any form. Each field can be prefilled from a field of an upstream form or from global data.

## Running locally

You need Node.js installed. Two processes run side by side.

1. Start the mock server (serves the graph on port 3000):

```
cd frontendchallengeserver
npm start
```

2. Start the app (Vite dev server on port 5173):

```
cd frontend
npm install
npm run dev
```

Open http://localhost:5173. The app calls relative URLs under `/api`, and the Vite dev server proxies those to `http://localhost:3000` (see the `server.proxy` entry in `frontend/vite.config.ts`). There is no env file to configure.

## Tests

```
cd frontend
npm run test:run
```

Type checking and production build:

```
npm run build
```

## How the app works

- The left side shows the forms of the blueprint, either as a list or as a React Flow graph (toggle at the top). Both views share the same selection state, so switching views keeps the selected form.
- Selecting a form opens the prefill panel on the right, one row per field.
- An unmapped field row is a button. Clicking it opens a modal that lists every available data element, grouped by data source, with a search box.
- Picking an element stores the mapping and the row shows it as a badge, for example "Form B.Email", with an X button to clear it.

## Architecture

The code is layered, and dependencies only point downward:

```
components  ->  prefill (state)  ->  domain  ->  api types
components  ->  prefill/data-sources  ->  domain
```

### src/api

The boundary with the server. `graph.types.ts` mirrors the wire format exactly (snake_case included) and only types the fields the app consumes. `queries.ts` holds the fetch function, which throws on non-OK responses so HTTP failures become rejected promises. `query-factory.ts` is a query options factory built on TanStack Query's `queryOptions` helper: the query key, the fetcher, the transform and the caching policy live in exactly one place. The `select` step converts the raw response into a `FormGraph`, so no component ever touches the wire format. The graph never changes during a session, so `staleTime: Infinity` disables pointless refetches.

### src/domain

Pure TypeScript, no React. `FormGraph` indexes the response once in its constructor and answers all graph questions:

- `getFieldsForNode` resolves fields through `component_id` into the shared form definitions. Field labels fall back to the schema key when a title is missing.
- `getDirectParents` returns the node's prerequisites.
- `getAncestors` is a breadth-first walk over prerequisites. A visited set deduplicates diamond paths and guards against cycles.
- `getTransitiveOnlyParents` is ancestors minus direct parents, so each upstream form appears in exactly one dependency group.

The payload encodes the DAG twice (an `edges` array and per-node `prerequisites`). The app treats prerequisites as the single source of truth. Even the graph view derives its edges from prerequisites, so the picture can never disagree with what the traversal computes.

Unknown ids return empty results instead of throwing. The domain layer feeds render paths, and a stale id during a refetch should degrade to an empty panel, not a crash.

### src/prefill/data-sources

The core design requirement: prefill data can come from many sources, any combination must work without code changes, and new sources must be easy to add. Every source implements one interface:

```ts
interface PrefillDataSource {
    id: string;
    label: string;
    getGroups(context: PrefillSourceContext): PrefillSourceGroup[];
}
```

`getGroups` receives a context object (the graph and the target node id) and returns labeled groups of selectable options. The context object makes the interface additive: a future source that needs extra input gets it by adding a field to the context, without touching existing sources.

Three sources exist today: direct dependencies, transitive dependencies and global data. The two dependency sources are one line of traversal each plus a shared helper that maps nodes to groups. The global source returns static groups and ignores the context entirely, which is the proof that the interface fits both graph-driven and constant sources.

`registry.ts` exports the array of all sources. The selection modal iterates this array and knows nothing about any concrete source. There is no branching on source type anywhere in the UI.

### src/prefill (state)

Mappings are held in React context with a reducer, deliberately not a state library, because the state is one small object with two verbs:

```
state[nodeId][fieldId] = {
    sourceId, groupId, groupLabel, optionId, optionLabel
}
```

The reducer is pure and lives in its own file with direct unit tests. It handles `SET_PREFILL` and `CLEAR_PREFILL` with immutable updates, returns the same reference when a clear is a no-op, and has a compile-time exhaustiveness guard for future action types.

State and dispatch live in two separate contexts. Dispatch is referentially stable, so write-only components (the modal) never re-render when mappings change. Ids are the identity of a selection; the labels are stored alongside as a display snapshot so rendering a badge needs no registry lookups.

### src/components

Components render and wire, nothing else. No component traverses the graph or filters options itself; that work lives in the pure layers.

- `graph/form-list.tsx` and `graph/forms-graph-view.tsx` are two interchangeable projections of the same selection state, with identical props. The graph view maps the domain graph into React Flow shapes in a pure adapter (`flow-mapping.ts`) and is read-only: positions come from the server data, so there is no layout engine and no dragging.
- `prefill/prefill-panel.tsx` shows the fields of the selected node and owns the "which field is picking a source" state.
- `prefill/prefill-field-row.tsx` shows one field: either the mapping with a clear button, or an empty affordance that opens the modal.
- `prefill/data-element-modal.tsx` renders one section per registered source, filters groups with a pure `filterGroups` function as you type, and assembles the stored selection at the only point where source, group and option are all in scope. It accepts the source list as a prop that defaults to the registry, which lets tests inject a fake source.

## Adding a new data source

Two steps, no other file changes.

1. Implement the interface in a new file, for example a source that offers the current user's profile fields:

```ts
// src/prefill/data-sources/user-profile.ts
import type { PrefillDataSource } from "./types";

export const userProfileSource: PrefillDataSource = {
    id: "user-profile",
    label: "User profile",
    getGroups: () => [
        {
            id: "profile",
            label: "Profile",
            options: [
                { id: "user_email", label: "User Email" },
                { id: "user_name", label: "User Name" },
            ],
        },
    ],
};
```

A source that needs the graph can use the context, like the dependency sources do: `getGroups: ({ graph, targetNodeId }) => ...`.

2. Register it:

```ts
// src/prefill/data-sources/registry.ts
export const prefillDataSources: readonly PrefillDataSource[] = [
    directDependenciesSource,
    transitiveDependenciesSource,
    globalDataSource,
    userProfileSource,
];
```

That is the whole change. The modal picks it up because it only iterates the registry, selections store its ids like any other source, and the existing tests keep passing. There is a test that renders the modal with a source invented inside the test itself, which pins this guarantee.

## Testing approach

- Tests run against the real server fixture (`src/test/fixtures/graph.json`), which is the same file the mock server serves, so tests and reality cannot drift.
- Pure logic (graph traversal, data sources, the reducer, search filtering) is tested directly, without rendering.
- The network is mocked at the HTTP level with MSW, so hook and component tests exercise the full pipeline: URL building, parsing and error handling. Unhandled requests fail the test.
- Component tests assert through the DOM using role and text queries. One end-to-end test covers the whole loop: open the modal, pick an element, see the badge, clear it.