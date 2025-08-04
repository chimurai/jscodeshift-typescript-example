import type { API, FileInfo } from 'jscodeshift';
import type { TestOptions } from 'jscodeshift/src/testUtils';

export default function transformer(file: FileInfo, api: API) {
  const j = api.jscodeshift;
  const root = j(file.source);

  const variableDeclarators = root.findVariableDeclarators('foo');
  variableDeclarators.renameTo('bar');

  return root.toSource();
}

// Use TypeScript parser for transformations
export const parser: TestOptions['parser'] = 'ts';
