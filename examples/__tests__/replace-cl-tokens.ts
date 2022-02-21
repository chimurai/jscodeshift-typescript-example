import { defineTest } from 'jscodeshift/src/testUtils';

describe("reverse identifiers", () => {
  defineTest(__dirname, './replace-cl-tokens', null, 'replace-cl-tokens/basic', { parser: 'ts' });
});
