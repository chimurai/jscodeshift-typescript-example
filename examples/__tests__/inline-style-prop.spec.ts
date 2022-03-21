import { defineTest } from 'jscodeshift/src/testUtils';

jest.spyOn(console, "error").mockImplementation(() => { });

describe("inline-style-prop", () => {
  [
    'inline-style-prop/dont-crash-on-these',
    'inline-style-prop/referenced-object',
    'inline-style-prop/basic',
    'inline-style-prop/flex-direction',
    'inline-style-prop/styles-with-spread',
  ].forEach(test => {
    defineTest(__dirname, '../codemods', null, test, { parser: 'tsx' });
  })
});
