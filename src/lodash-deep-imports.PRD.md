# lodash-deep-imports

Rewrite named imports from `lodash` into deep default imports from `lodash/<function>`.

## Examples

before:
```ts
import { pluck } from 'lodash';
```

after:
```ts
import pluck from 'lodash/pluck';
```

## Requirements

- [FR-1] Convert each named specifier in `import { ... } from 'lodash'` into its own default import from `lodash/<importedName>`.
- [FR-2] Preserve local aliases by using the local binding as the default import identifier (for example `map as mapFn` becomes `import mapFn from 'lodash/map'`).
- [FR-3] For mixed lodash imports (default/namespace + named), remove only named specifiers and preserve non-named specifiers on the original `lodash` import.
- [FR-4] Remove the original `lodash` import declaration if all of its specifiers were named and converted.
- [FR-5] Insert generated deep imports before the first existing import declaration in the file.
- [FR-6] Generate deep import paths using the imported lodash member name exactly as written (`lodash/<member>`), including case.
- [FR-7] Keep non-lodash imports and runtime code usage unchanged.
- [FR-8] Be idempotent for already-transformed code where no named imports from `lodash` remain.

## Edge Cases

- [EDGE-1] Leave files without `lodash` imports unchanged.
- [EDGE-2] Leave default-only lodash imports unchanged (`import _ from 'lodash'`).
- [EDGE-3] Leave namespace lodash imports unchanged (`import * as _ from 'lodash'`).
- [EDGE-4] When both converted deep imports and preserved lodash default/namespace imports exist, place deep imports first and keep preserved lodash import after them.
- [EDGE-5] Preserve TypeScript syntax and non-import declarations while transforming imports.

## Out of scope

- [OOS-1] Validating whether every imported member exists as a real lodash deep import module.
- [OOS-2] Deduplicating against pre-existing deep imports or consolidating duplicate generated imports across declarations.
- [OOS-3] Reordering unrelated imports beyond inserting generated deep imports before the first import.
- [OOS-4] Rewriting imports from packages other than exactly `lodash` (for example `lodash/fp` or `lodash-es`).
