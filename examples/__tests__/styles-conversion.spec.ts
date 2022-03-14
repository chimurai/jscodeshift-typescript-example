import { defineTest } from 'jscodeshift/src/testUtils';

jest.spyOn(console, "error").mockImplementation(() => { });

describe("styles conversion", () => {
  defineTest(__dirname, './styles-conversion.ts', null, 'styles-conversion/basic', { parser: 'tsx' });
});
