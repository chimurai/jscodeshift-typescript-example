import { API, FileInfo } from 'jscodeshift';
import * as _ from 'lodash/fp';
import { transformInlineStyleProps } from './/inline-style-prop';
import { commitManualLogs } from '../logger';
import { transformRenameJSXPrimitives } from './rename-jsx-primitives';
import { transformStyledCompoentsToUCL } from './styled-components-to-ucl';
import { transformRenameOnclick } from './rename-onclick';
import { transformComponentLibImports } from './components-lib-imports';

export const parser = 'tsx';
export default function transformer(fileInfo: FileInfo, api: API) {
  const j = api.jscodeshift;

  const root = j(fileInfo.source);

  transformComponentLibImports(root, j, fileInfo);
  transformInlineStyleProps(root, j, fileInfo);
  transformRenameJSXPrimitives(root, j, fileInfo);
  transformStyledCompoentsToUCL(root, j, fileInfo);
  transformRenameOnclick(root, j, fileInfo);

  const source = root.toSource({ quote: 'single', trailingComma: true });
  commitManualLogs(source);
  return source;
}
