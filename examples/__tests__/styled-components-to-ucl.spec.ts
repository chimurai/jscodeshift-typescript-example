import { defineTest } from 'jscodeshift/src/testUtils';

jest.spyOn(console, "error").mockImplementation(() => { });

describe("styled-components to UCL", () => {
  // defineTest(__dirname, './styled-components-to-ucl/index.ts', null, 'styled-components-to-ucl/bad', { parser: 'ts' });
  // defineTest(__dirname, './styled-components-to-ucl/index.ts', null, 'styled-components-to-ucl/basic', { parser: 'ts' });
  // defineTest(__dirname, './styled-components-to-ucl/index.ts', null, 'styled-components-to-ucl/comments', { parser: 'ts' });
  // defineTest(__dirname, './styled-components-to-ucl/index.ts', null, 'styled-components-to-ucl/complex', { parser: 'ts' });
  // defineTest(__dirname, './styled-components-to-ucl/index.ts', null, 'styled-components-to-ucl/complex2', { parser: 'ts' });
  // defineTest(__dirname, './styled-components-to-ucl/index.ts', null, 'styled-components-to-ucl/complex3', { parser: 'ts' });
  // defineTest(__dirname, './styled-components-to-ucl/index.ts', null, 'styled-components-to-ucl/complex4', { parser: 'ts' });
  // defineTest(__dirname, './styled-components-to-ucl/index.ts', null, 'styled-components-to-ucl/css-template', { parser: 'ts' });
  // @ts-ignore
  defineTest(__dirname, './styled-components-to-ucl/index.ts', null, 'styled-components-to-ucl/js-file', { parser: 'js' });
  // defineTest(__dirname, './styled-components-to-ucl/index.ts', null, 'styled-components-to-ucl/media', { parser: 'ts' });
  // defineTest(__dirname, './styled-components-to-ucl/index.ts', null, 'styled-components-to-ucl/media2', { parser: 'ts' });
  // defineTest(__dirname, './styled-components-to-ucl/index.ts', null, 'styled-components-to-ucl/pseudo', { parser: 'ts' });
  // defineTest(__dirname, './styled-components-to-ucl/index.ts', null, 'styled-components-to-ucl/should-ignore', { parser: 'tsx' });
  // defineTest(__dirname, './styled-components-to-ucl/index.ts', null, 'styled-components-to-ucl/single', { parser: 'ts' });
  // defineTest(__dirname, './styled-components-to-ucl/index.ts', null, 'styled-components-to-ucl/spacing', { parser: 'ts' });
});
