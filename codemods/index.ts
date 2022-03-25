import { API, FileInfo } from 'jscodeshift';
import * as _ from 'lodash/fp';
import { transformInlineStyleProps } from './inline-style-prop';
import { commitManualLogs, logManualWork } from '../logger';
import { transformRenameJSXPrimitives } from './rename-jsx-primitives';
import { transformStyledCompoentsToUCL } from './styled-components-to-ucl';
import { transformRenameOnclick } from './rename-onclick';
import { transformComponentLibImports } from './components-lib-imports';
import { ConversionError } from './utils/conversion-error';
import { transformWrapinMakeUcl } from './wrap-make-ucl';

export const parser = 'tsx';
export default function transformer(fileInfo: FileInfo, api: API) {
  const j = api.jscodeshift;

  const root = j(fileInfo.source);

  try {
    transformComponentLibImports(root, j, fileInfo);
    transformInlineStyleProps(root, j, fileInfo);
    transformRenameJSXPrimitives(root, j, fileInfo);
    transformStyledCompoentsToUCL(root, j, fileInfo);
    transformRenameOnclick(root, j, fileInfo);
    transformWrapinMakeUcl(root, j, fileInfo);
  } catch (e) {
    if (e instanceof ConversionError) {
      console.error(e.reason);
      logManualWork({
        filePath: fileInfo.path,
        helpfulMessage: e.reason,
        startingLine: 0,
        endingLine: 0,
        skipSource: true,
      });

      return fileInfo.source;
    }

    throw e;
  }

  const source = root.toSource({ quote: 'single', trailingComma: true });
  commitManualLogs(source);
  return source;
}
