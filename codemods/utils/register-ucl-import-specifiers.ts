import { Collection, JSCodeshift } from "jscodeshift";
import * as _ from "lodash";

// This makes sure we are importing all of the components from the UCL.
// We first check to see if the file has an import first, and if it is we need to preserve it.
// Otherwise we have to create one and make sure all specifiers are imported
export function registerUCLImportSpecifiers(
  root: Collection<any>,
  j: JSCodeshift,
  specifier: string,
) {
  const specifiers = new Set<string>([specifier]);

  const addUCLImport = (componentRealName) => {
    // Prefix with UCL if there is a local variable with the same name
    if (hasScopeConflict(root, j, componentRealName)) {
      return "UCL" + componentRealName;
    }
    return componentRealName;
  };

  // 1. make sure we have all the imports already imported from the ucl,
  // but then delete it so we can idompotently add the new ones as a fresh new import
  root
    .find(
      j.ImportDeclaration,
      (node) => node.source.value === "@rbilabs/universal-components",
    )
    .forEach((node) => {
      j(node)
        .find(j.ImportSpecifier)
        .forEach((path) => {
          specifiers.add(path.value.imported.name);
        });
    })
    // 1.a remove the import
    .remove();

  // 2. Add import to UCL with all the specifiers
  root.find(j.Program).forEach((path) => {
    const importSpecifiers = Array.from(specifiers)
      .sort((a, b) => a.localeCompare(b))
      .map((specifier) => {
        const needsImportRenaming = addUCLImport(specifier) !== specifier;

        return j.importSpecifier.from({
          imported: j.identifier(specifier),
          ...(needsImportRenaming
            ? { local: j.identifier(addUCLImport(specifier)) }
            : {}),
        });
      });

    path.node.body.unshift(
      j.importDeclaration(
        importSpecifiers,
        j.stringLiteral("@rbilabs/universal-components"),
      ),
    );
  });

  return addUCLImport(specifier);
}

function hasScopeConflict(
  root: Collection<any>,
  j: JSCodeshift,
  specifier: string,
) {
  // some variable exists that interferes.
  if (root.findVariableDeclarators(specifier).size() !== 0) {
    return true;
  }

  // some import already exists that interferes
  if (
    root
      .find(
        j.ImportDeclaration,
        (node) => node.source.value !== "@rbilabs/universal-components",
      )
      .filter((i) =>
        i.value.specifiers?.some((s) => s.local?.name === specifier),
      )
      .size() !== 0
  ) {
    return true;
  }
}
