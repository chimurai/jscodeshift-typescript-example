import { Collection, JSCodeshift } from "jscodeshift";

// This makes sure we are importing all of the components from the UCL.
// We first check to see if the file has an import first, and if it is we need to preserve it.
// Otherwise we have to create one and make sure all specifiers are imported
export function registerUCLImportSpecifiers(
  root: Collection<any>,
  j: JSCodeshift,
  specifierSet: Set<string>,
) {
  // 1. make sure we have all the imports already imported from the ucl,
  // but then delete it so we can idompotently add the new ones as a fresh new import
  root
    .find(
      j.ImportDeclaration,
      (node) => node.source.value === "@rbilabs/universal-components",
    )
    .forEach((node) => {
      node.value.specifiers.forEach((specifier) => {
        specifierSet.add(specifier.local.name);
      });
    })
    // 1.a remove the import
    .remove();

  // 2. Add import to UCL with all the specifiers
  root.find(j.Program).forEach((path) => {
    const specifiers = Array.from(specifierSet).map((specifier) =>
      j.importSpecifier(j.identifier(specifier)),
    );

    path.node.body.unshift(
      j.importDeclaration(
        specifiers,
        j.stringLiteral("@rbilabs/universal-components"),
      ),
    );
  });
}
