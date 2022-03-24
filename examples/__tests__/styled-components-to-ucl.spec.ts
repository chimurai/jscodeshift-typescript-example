import { defineTest } from 'jscodeshift/src/testUtils';

// jest.spyOn(console, "error").mockImplementation(() => { });

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
  defineTest(__dirname, '../codemods', null, 'styled-components-to-ucl/interpolated', { parser: 'ts' });
  defineTest(__dirname, '../codemods', null, 'styled-components-to-ucl/line-height', { parser: 'ts' });
  defineTest(__dirname, '../codemods', null, 'styled-components-to-ucl/mapping-custom-processing', { parser: 'ts' });
  defineTest(__dirname, '../codemods', null, 'styled-components-to-ucl/media', { parser: 'ts' });
  defineTest(__dirname, '../codemods', null, 'styled-components-to-ucl/media2', { parser: 'ts' });
  defineTest(__dirname, '../codemods', null, 'styled-components-to-ucl/one-offs', { parser: 'ts' });
  defineTest(__dirname, '../codemods', null, 'styled-components-to-ucl/pseudo', { parser: 'ts' });
  defineTest(__dirname, '../codemods', null, 'styled-components-to-ucl/should-ignore', { parser: 'tsx' });
  defineTest(__dirname, '../codemods', null, 'styled-components-to-ucl/single', { parser: 'ts' });
  defineTest(__dirname, '../codemods', null, 'styled-components-to-ucl/spacing', { parser: 'ts' });
  defineTest(__dirname, '../codemods', null, 'styled-components-to-ucl/types', { parser: 'ts' });
  defineTest(__dirname, '../codemods', null, 'styled-components-to-ucl/unsupported', { parser: 'ts' });
  // @ts-ignore
  defineTest(__dirname, '../codemods', null, 'styled-components-to-ucl/js-file', { parser: 'js' });


  // rename-jsx-primitives
  defineTest(__dirname, '../codemods', null, 'rename-jsx-primitives/basic', { parser: 'tsx' });

  // WL components
  defineTest(__dirname, '../codemods', null, 'wl-components/reward-categories/components/styled', { parser: 'tsx' });
  defineTest(__dirname, '../codemods', null, 'wl-components/account-orders/styled.base', { parser: 'ts' });
});
