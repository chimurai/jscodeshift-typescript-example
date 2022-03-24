import { Collection, FileInfo, JSCodeshift } from 'jscodeshift';
import { registerImportSpecifiers } from './utils/register-ucl-import-specifiers';

export function transformWrapinMakeUcl(root: Collection<any>, j: JSCodeshift, fileInfo: FileInfo) {
  const importMap = collectImportsIntoMap(root, j);

  // search for things like Modal.withConfig
  // and if Modal is not from '@rbilabs/universal-components'
  // then we convert it to `makeUclComponent(Modal).withConfig
  root
    .find(j.MemberExpression, {
      property: {
        name: 'withConfig',
      },
    })
    .forEach(path => {
      if (path.value.object.type !== 'Identifier') {
        throw Error('unkonwn member expression type');
      }

      const ComponentName = path.value.object.name;

      if (!importMap[ComponentName]) {
        return;
      }

      const source = importMap[ComponentName];

      if (source !== '@rbilabs/universal-components') {
        registerImportSpecifiers(root, j, 'makeUclComponent');

        path.value.object = j.callExpression.from({
          callee: j.identifier('makeUclComponent'),
          arguments: [path.value.object],
        });
      }
    });
}

function collectImportsIntoMap(root: Collection<any>, j: JSCodeshift) {
  // Map of ComponentName to import path
  // e.g., { Modal: 'components/modal' }
  const importMap = {};

  // first collec
  root.find(j.ImportDeclaration).forEach(p => {
    const importName = p.value.source.value;

    j(p)
      .find(j.ImportSpecifier)
      .forEach(p => {
        importMap[p.value.local?.name ?? p.value.imported.name] = importName;
      });
    j(p)
      .find(j.ImportDefaultSpecifier)
      .forEach(p => {
        importMap[p.value.local.name] = importName;
      });
  });

  return importMap;
}
