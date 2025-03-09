import type { API, FileInfo } from 'jscodeshift';

export default function transformer(file: FileInfo, api: API) {
  const j = api.jscodeshift;
  const root = j(file.source);

  const variableDeclarators = root.findVariableDeclarators('foo');
  variableDeclarators.renameTo('bar');

  return root.toSource();
}
