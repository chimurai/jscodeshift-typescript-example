Use deep imports for lodash functions

Use #context7-mcp to find lodash functions to create extensive test suite

before:
```ts
import { pluck } from 'lodash';
```

after:
```ts
import pluck from 'lodash/pluck';
