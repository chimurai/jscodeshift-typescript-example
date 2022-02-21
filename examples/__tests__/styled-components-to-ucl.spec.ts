import { defineTest } from 'jscodeshift/src/testUtils';

describe("renaming a variable", () => {
  defineTest(__dirname, './styled-components-to-ucl', null, 'styled-components-to-ucl/basic', { parser: 'ts' });
});
