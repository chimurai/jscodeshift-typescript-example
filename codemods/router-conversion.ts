import {
  ASTPath,
  API,
  Collection,
  FileInfo,
  ImportDeclaration,
} from "jscodeshift";
import * as jscodeshift from "jscodeshift";
import { format } from "prettier";

function collectImportElementsFromReactRouter(
  root: Collection<any>,
  j: typeof jscodeshift,
) {
  // collect all the importPaths
  const importPaths: string[][] = [];
  root
    .find(
      j.ImportDeclaration,
      (path) => path.source.value === "react-router-dom",
    )
    .forEach((path) => {
      // pull out the name of the imports
      path.value.specifiers.forEach((node) => {
        importPaths.push([
          // @ts-ignore
          node.imported?.name,
          // @ts-ignore
          node.local.name || node.imported?.name,
        ]);
      });
    })
    .remove();

  return importPaths;
}

function findOrCreateImport(
  root: Collection<any>,
  j: typeof jscodeshift,
  identifier: string,
) {
  let stateImportNode: ASTPath<ImportDeclaration>;

  // Find a state/location import
  root
    .find(j.ImportDeclaration, (path) => path.source.value === identifier)
    .forEach((node) => {
      stateImportNode = node;
    });

  if (!stateImportNode) {
    root.find(j.Program).forEach((path) => {
      path.node.body.unshift(
        j.importDeclaration([], j.stringLiteral(identifier), "value"),
      );
    });
    return findOrCreateImport(root, j, identifier);
  }

  return stateImportNode;
}

function handleUseLocationContextNode(
  root: Collection<any>,
  j: typeof jscodeshift,
  method: string,
  identifier: string,
) {
  const methodCalls = root.find(
    j.CallExpression,
    (node) => node.callee.type === "Identifier" && node.callee.name === method,
  );

  methodCalls.forEach((methodCall) => {
    switch (methodCall.parentPath.node.type) {
      // useLocation().pathname
      case "MemberExpression":
        let path = methodCall.parentPath;
        while (path?.node.type !== "BlockStatement") {
          path = path.parentPath;
        }
        path.value.unshift(
          j.variableDeclaration("const", [
            j.variableDeclarator.from({
              id: j.objectPattern.from({
                properties: [
                  j.objectProperty.from({
                    key: j.identifier(identifier),
                    value: j.identifier(identifier),
                    shorthand: true,
                  }),
                ],
              }),
              init: j.callExpression(j.identifier("useLocationContext"), []),
            }),
          ]),
        );
        methodCall.parentPath.node.object = j.identifier(identifier);
      default:
    }
  });

  root
    .find(j.VariableDeclaration, (node) =>
      node.declarations.some(
        (p) =>
          p.type === "VariableDeclarator" &&
          p.init?.type === "CallExpression" &&
          p.init.callee.type === "Identifier" &&
          p.init.callee.name === method,
      ),
    )
    .replaceWith(
      j.variableDeclaration("const", [
        j.variableDeclarator.from({
          id: j.objectPattern.from({
            properties: [
              j.objectProperty.from({
                key: j.identifier(identifier),
                value: j.identifier(identifier),
                shorthand: true,
              }),
            ],
          }),
          init: j.callExpression(j.identifier("useLocationContext"), []),
        }),
      ]),
    );
}

export const parser = "tsx";
// converts imports from react-router-dom to state/location
export default function transformer(file: FileInfo, api: API) {
  if (
    file.path.includes(".test") ||
    file.path.includes(".spec") ||
    file.path.includes("__tests__") ||
    file.path.includes("state/locatin")
  ) {
    return file.source;
  }

  try {
    const j = api.jscodeshift;

    const root = j(file.source);

    const importedIdentifiers = collectImportElementsFromReactRouter(root, j);

    // This file doesnt have any imports to react-router-dom, so we can skip
    if (importedIdentifiers.length === 0) {
      return;
    }

    function addImport(importNode: any, identifier: string) {
      const hasImport = importNode.value.specifiers.some(
        (p) => p.imported.name === identifier,
      );

      if (!hasImport) {
        importNode.value.specifiers.push(
          j.importSpecifier(j.identifier(identifier)),
        );
      }
    }

    for (const [importPath, identifier] of importedIdentifiers) {
      switch (importPath) {
        case "BrowserRouter":
        case "Routes":
        case "Route":
        case "useSearchParams":
          throw Error(`cant convert ${importPath}`);

        case "Link":
          const importNode = findOrCreateImport(root, j, "components/link");
          const hasImport = importNode.value.specifiers.some(
            (p) => p.local?.name === identifier,
          );

          if (!hasImport) {
            importNode.value.specifiers.push(
              j.importDefaultSpecifier(j.identifier(identifier)),
            );
          }
          break;
        case "Navigate":
          addImport(findOrCreateImport(root, j, "state/location"), "Navigate");
          break;
        case "useMatch":
          addImport(findOrCreateImport(root, j, "state/location"), "useMatch");
          break;
        case "useParams":
          addImport(findOrCreateImport(root, j, "state/location"), "useParams");
          break;
        case "useNavigate":
          addImport(
            findOrCreateImport(root, j, "state/location"),
            "useLocationContext",
          );
          handleUseLocationContextNode(root, j, "useNavigate", "navigate");
          break;
        case "useLocation":
          addImport(
            findOrCreateImport(root, j, "state/location"),
            "useLocationContext",
          );
          handleUseLocationContextNode(root, j, "useLocation", "location");
          break;
      }
    }

    return root.toSource({ quote: "single", trailingComma: true });
    // formatting for tests
    // return format(root.toSource(), {
    //   parser: "babel",
    // });
  } catch (e) {
    console.log("skipping file", file.path);
    console.log(e);
    return file.source;
  }
}
