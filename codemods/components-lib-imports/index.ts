import { Collection, FileInfo, JSCodeshift } from 'jscodeshift';
import { registerUCLImportSpecifiers } from '../utils/register-ucl-import-specifiers';

// Deletes any imports from the component library
export function transformComponentLibImports(
  root: Collection<any>,
  j: JSCodeshift,
  fileInfo: FileInfo
) {
  root
    .find(j.ImportDeclaration, node => node.source.value === '@rbilabs/component-library')
    .forEach(path => {
      // copy all imports to the UCL first.
      // Do we need to prune out any imports that aren't supported in the UCL? or named differently?
      j(path)
        .find(j.ImportSpecifier)
        .forEach(specifier => {
          registerUCLImportSpecifiers(root, j, specifier.value.imported.name);
        });
    })
    // remove the old CL
    .remove();
}
