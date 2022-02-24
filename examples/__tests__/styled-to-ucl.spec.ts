import { defineTest } from 'jscodeshift/src/testUtils';

describe("renaming a variable", () => {
  defineTest(__dirname, './styled-to-ucl/index.ts', null, 'styled-to-ucl/basic', { parser: 'ts' });
});
