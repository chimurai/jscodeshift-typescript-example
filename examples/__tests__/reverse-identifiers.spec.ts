import { defineTest } from 'jscodeshift/src/testUtils';

describe("reverse identifiers", () => {
  defineTest(__dirname, './reverse-identifiers', null, 'reverse-identifiers/basic', { parser: 'ts' });
});
