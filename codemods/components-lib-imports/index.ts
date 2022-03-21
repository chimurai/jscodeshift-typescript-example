import { Collection, FileInfo, JSCodeshift } from 'jscodeshift';
import { handleMapping } from './handle-mapping';

// Deletes any imports from the component library
export function transformComponentLibImports(
  root: Collection<any>,
  j: JSCodeshift,
  fileInfo: FileInfo
) {
  // loop over every import specifier and handle each import uniquely
  root
    .find(j.ImportDeclaration, {
      source: {
        value: '@rbilabs/components-library',
      },
    })
    .forEach(path => {
      const specifiers = [...(path.value.specifiers ?? [])];
      specifiers.forEach(specifier => {
        if (specifier.type === 'ImportSpecifier') {
          handleMapping(specifier.imported.name, root, j, fileInfo);
        } else {
          console.log(
            'wtfff - unexpected import specifier for the @rbilabs/components-library',
            specifier.type,
            fileInfo.path
          );
        }
      });
    });

  // Check to see if all references were removed from the component library import
  // if they were, remove the import entirely
  root
    .find(j.ImportDeclaration, {
      source: {
        value: '@rbilabs/components-library',
      },
    })
    .filter(p => !p.value.specifiers?.length)
    .remove();
}
