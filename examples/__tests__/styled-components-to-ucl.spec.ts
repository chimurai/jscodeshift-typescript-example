import { defineTest } from 'jscodeshift/src/testUtils';

jest.spyOn(console, "error").mockImplementation(() => { });

describe("styled-components to UCL", () => {
  defineTest(__dirname, '../codemods', null, 'styled-components-to-ucl/bad', { parser: 'ts' });
  defineTest(__dirname, '../codemods', null, 'styled-components-to-ucl/basic', { parser: 'ts' });
  defineTest(__dirname, '../codemods', null, 'styled-components-to-ucl/comments', { parser: 'ts' });
  defineTest(__dirname, '../codemods', null, 'styled-components-to-ucl/complex', { parser: 'ts' });
  defineTest(__dirname, '../codemods', null, 'styled-components-to-ucl/complex2', { parser: 'ts' });
  defineTest(__dirname, '../codemods', null, 'styled-components-to-ucl/complex3', { parser: 'ts' });
  defineTest(__dirname, '../codemods', null, 'styled-components-to-ucl/complex4', { parser: 'ts' });
  defineTest(__dirname, '../codemods', null, 'styled-components-to-ucl/complex5', { parser: 'ts' });
  defineTest(__dirname, '../codemods', null, 'styled-components-to-ucl/complex6', { parser: 'ts' });
  defineTest(__dirname, '../codemods', null, 'styled-components-to-ucl/css-template', { parser: 'ts' });
  defineTest(__dirname, '../codemods', null, 'styled-components-to-ucl/media', { parser: 'ts' });
  defineTest(__dirname, '../codemods', null, 'styled-components-to-ucl/mapping-custom-processing', { parser: 'ts' });
  defineTest(__dirname, '../codemods', null, 'styled-components-to-ucl/media2', { parser: 'ts' });
  defineTest(__dirname, '../codemods', null, 'styled-components-to-ucl/pseudo', { parser: 'ts' });
  defineTest(__dirname, '../codemods', null, 'styled-components-to-ucl/should-ignore', { parser: 'tsx' });
  defineTest(__dirname, '../codemods', null, 'styled-components-to-ucl/single', { parser: 'ts' });
  defineTest(__dirname, '../codemods', null, 'styled-components-to-ucl/spacing', { parser: 'ts' });
  defineTest(__dirname, '../codemods', null, 'styled-components-to-ucl/unsupported', { parser: 'ts' });
  // @ts-ignore
  defineTest(__dirname, '../codemods', null, 'styled-components-to-ucl/js-file', { parser: 'js' });


  // rename-jsx-primitives
  defineTest(__dirname, '../codemods', null, 'rename-jsx-primitives/basic', { parser: 'tsx' });

  // inline-style-props
  [
    'inline-style-prop/dont-crash-on-these',
    'inline-style-prop/referenced-object',
    'inline-style-prop/basic',
    'inline-style-prop/flex-flip',
    'inline-style-prop/styles-with-spread',
  ].forEach(test => {
    defineTest(__dirname, '../codemods', null, test, { parser: 'tsx' });
  })


  // WL components
  defineTest(__dirname, '../codemods', null, 'wl-components/reward-categories/components/styled', { parser: 'tsx' });
});
