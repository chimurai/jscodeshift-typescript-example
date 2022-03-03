import { defineTest } from 'jscodeshift/src/testUtils';

describe("renaming a variable", () => {
  defineTest(__dirname, './styled-components-to-ucl/index.ts', null, 'styled-components-to-ucl/basic', { parser: 'ts' });
  defineTest(__dirname, './styled-components-to-ucl/index.ts', null, 'styled-components-to-ucl/comments', { parser: 'ts' });
  defineTest(__dirname, './styled-components-to-ucl/index.ts', null, 'styled-components-to-ucl/complex', { parser: 'ts' });
  defineTest(__dirname, './styled-components-to-ucl/index.ts', null, 'styled-components-to-ucl/complex2', { parser: 'ts' });
  // defineTest(__dirname, './styled-components-to-ucl/index.ts', null, 'styled-components-to-ucl/media', { parser: 'ts' });
  defineTest(__dirname, './styled-components-to-ucl/index.ts', null, 'styled-components-to-ucl/pseudo', { parser: 'ts' });
  defineTest(__dirname, './styled-components-to-ucl/index.ts', null, 'styled-components-to-ucl/single', { parser: 'ts' });
  defineTest(__dirname, './styled-components-to-ucl/index.ts', null, 'styled-components-to-ucl/spacing', { parser: 'ts' });
});
