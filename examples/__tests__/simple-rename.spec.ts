import { defineTest } from 'jscodeshift/src/testUtils';

describe("renaming a variable", () => {
  defineTest(__dirname, './simple-rename', null, 'simple-rename/basic', { parser: 'ts' });
});
