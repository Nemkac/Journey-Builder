import { directDependenciesSource } from "./direct-dependencies";
import { globalDataSource } from "./global-data";
import { transitiveDependenciesSource } from "./transitive-dependencies";
import type { PrefillDataSource } from "./types";

export const prefillDataSources: readonly PrefillDataSource[] = [
    directDependenciesSource,
    transitiveDependenciesSource,
    globalDataSource
];

