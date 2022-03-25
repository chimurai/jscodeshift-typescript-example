import { defineTest } from 'jscodeshift/src/testUtils';

jest.spyOn(console, "error").mockImplementation(() => { });

describe("aria", () => {
  [
    'aria/aria-label',
  ].forEach(test => {
    defineTest(__dirname, '../codemods', null, test, { parser: 'tsx' });
  })
});
