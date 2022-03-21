import { defineTest, applyTransform } from 'jscodeshift/src/testUtils';

jest.spyOn(console, "error").mockImplementation(() => { });

describe("component-lib-imports", () => {
  defineTest(__dirname, '../codemods', null, 'component-lib-imports/basic', { parser: 'tsx' });
  defineTest(__dirname, '../codemods', null, 'component-lib-imports/deletes-import', { parser: 'tsx' });

  [
    'Footer',
    'IFooterProps',
    'themeBk',
    'themeTh',
    'themePlk',
    'GlobalStylesBk',
    'GlobalStylesPlk',
    'GlobalStylesTh',
  ].forEach(importSpecifier => {
    test(`Expected throw for import specifier (${importSpecifier})`, () => {
      // We throw, but catch it and just return the input directly. No modifications
      const source = `import { ${importSpecifier} } from '@rbilabs/components-library';`

      expect(applyTransform(require('../../codemods'), {}, { source})).toEqual(source)
    })
  })
});
