# Lodash Deep Imports Transformer

**Input**: "Use deep imports for lodash functions"

## Requirements

This transformer converts named imports from `lodash` to individual deep imports to enable better tree-shaking and reduce bundle size. It transforms destructured imports (named imports) from the main lodash package to individual default imports from specific lodash function modules.

## Functional Requirements

- FR-001: Transformer MUST convert named imports like `import { map, filter } from 'lodash'` to separate deep imports
- FR-002: Transformer MUST preserve existing default imports (`import _`) and namespace imports (`import * as _`)
- FR-003: Transformer MUST maintain aliased imports with their local names
- FR-004: Transformer MUST handle mixed import scenarios (default + named imports)
- FR-005: Transformer MUST preserve all other non-lodash imports
- FR-006: Transformer MUST maintain import order and code formatting
- FR-007: Transformer MUST ensure idempotency - running multiple times produces same result
- FR-008: Transformer MUST only transform imports from 'lodash' package (exact match)
- FR-009: Transformer MUST support all lodash function categories (array, object, string, etc.)
- FR-010: Transformer MUST maintain TypeScript compatibility and code formatting

## Edge Cases

- EDGE-001: Mixed imports with both default and named specifiers should split into separate imports
- EDGE-002: Aliased imports must preserve the local name binding
- EDGE-003: Non-lodash imports must remain unchanged
- EDGE-004: Running the transformer multiple times should produce identical results (idempotency)

## Transformation Examples

### EXAMPLE-001: Basic Named Import Conversion

Before:
```ts
import { map, filter, reduce } from 'lodash';

const result = map(data, filter);
```

After:
```ts
import map from 'lodash/map';
import filter from 'lodash/filter';
import reduce from 'lodash/reduce';

const result = map(data, filter);
```

### EXAMPLE-002: Aliased Imports

Before:
```ts
import { map as mapFunc, filter as filterFunc } from 'lodash';

const result = mapFunc(data, filterFunc);
```

After:
```ts
import mapFunc from 'lodash/map';
import filterFunc from 'lodash/filter';

const result = mapFunc(data, filterFunc);
```

### EXAMPLE-003: Mixed Import Types

Before:
```ts
import _, { map, filter } from 'lodash';

const result1 = _.reduce(data, fn);
const result2 = map(data, fn);
```

After:
```ts
import map from 'lodash/map';
import filter from 'lodash/filter';
import _ from 'lodash';

const result1 = _.reduce(data, fn);
const result2 = map(data, fn);
```

### EXAMPLE-004: Preserving Existing Imports

Before:
```ts
import React from 'react';
import { debounce, throttle } from 'lodash';
import { Component } from '@angular/core';

const debouncedFn = debounce(fn, 300);
```

After:
```ts
import debounce from 'lodash/debounce';
import throttle from 'lodash/throttle';
import React from 'react';
import { Component } from '@angular/core';

const debouncedFn = debounce(fn, 300);
```

### EXAMPLE-005: Complex Lodash Functions

Before:
```ts
import { chain, map, filter, value, cloneDeep, merge } from 'lodash';

const result = chain(data)
  .map(item => item.value)
  .filter(value => value > 0)
  .value();

const merged = merge(cloneDeep(obj1), obj2);
```

After:
```ts
import chain from 'lodash/chain';
import map from 'lodash/map';
import filter from 'lodash/filter';
import value from 'lodash/value';
import cloneDeep from 'lodash/cloneDeep';
import merge from 'lodash/merge';

const result = chain(data)
  .map(item => item.value)
  .filter(value => value > 0)
  .value();

const merged = merge(cloneDeep(obj1), obj2);
```

## JSCodeshift Abstract Syntax Tree Node Types

- **ImportDeclaration**: For import statements like `import { map } from 'lodash'`
- **ImportSpecifier**: For named import specifiers like `map` in destructured imports
- **ImportDefaultSpecifier**: For default imports like `import _ from 'lodash'`
- **ImportNamespaceSpecifier**: For namespace imports like `import * as _ from 'lodash'`
- **Identifier**: For function names and local variable names in imports
- **Literal**: For module path strings like `'lodash'` and `'lodash/map'`
