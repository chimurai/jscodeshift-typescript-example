import { defineTest } from 'jscodeshift/src/testUtils';

describe("renaming a variable", () => {
  defineTest(__dirname, './styled-components-to-ucl/index.ts', null, 'styled-components-to-ucl/basic', { parser: 'ts' });
  defineTest(__dirname, './styled-components-to-ucl/index.ts', null, 'styled-components-to-ucl/comments', { parser: 'ts' });
});
