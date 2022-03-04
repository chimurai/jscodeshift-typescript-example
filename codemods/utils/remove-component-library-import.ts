import { Collection, JSCodeshift } from "jscodeshift";

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
    .remove();
}
