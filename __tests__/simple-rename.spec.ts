import { defineTest } from 'jscodeshift/src/testUtils';

describe("renaming a variable", () => {
  defineTest(__dirname, 'src/simple-rename', null, 'simple-rename/basic', { parser: 'ts' });
});
