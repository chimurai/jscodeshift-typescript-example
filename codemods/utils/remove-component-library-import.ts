import { Collection, JSCodeshift } from "jscodeshift";
import { registerUCLImportSpecifiers } from "./register-ucl-import-specifiers";

// Deletes any imports from the component library
export function removeComponentLibaryImport(
  root: Collection<any>,
  j: JSCodeshift,
) {
  root
    .find(
      j.ImportDeclaration,
      (node) => node.source.value === "@rbilabs/component-library",
    )
    .forEach((path) => {
      // copy all imports to the UCL first.
      // Do we need to prune out any imports that aren't supported in the UCL? or named differently?
      j(path)
        .find(j.ImportSpecifier)
        .forEach((specifier) => {
          registerUCLImportSpecifiers(root, j, specifier.value.imported.name);
        });
    })
    // remove the old CL import
    .remove();
}
