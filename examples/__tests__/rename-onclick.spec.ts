import { defineTest } from 'jscodeshift/src/testUtils';

jest.spyOn(console, "error").mockImplementation(() => { });

describe("styled-components to UCL", () => {
  defineTest(__dirname, '../codemods', null, 'rename-onclick/basic', { parser: 'tsx' });
  defineTest(__dirname, '../codemods', null, 'rename-onclick/types', { parser: 'tsx' });
  defineTest(__dirname, '../codemods', null, 'rename-onclick/imported-type', { parser: 'tsx' });
});
