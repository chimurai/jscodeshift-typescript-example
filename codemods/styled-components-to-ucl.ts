import { Collection, FileInfo, JSCodeshift } from "jscodeshift";
import {
  getElementMapping,
  styledComponentImportFunctionShouldBeRemove,
} from "./utils/mappings";
import { processElement } from "./utils/process-element";
import * as _ from "lodash/fp";
import { registerUCLImportSpecifiers } from "./utils/register-ucl-import-specifiers";

export function transformStyledCompoentsToUCL(
  root: Collection<any>,
  j: JSCodeshift,
  fileInfo: FileInfo,
) {
  const isJSFile = fileInfo.path.endsWith(".js");
  const filePath = fileInfo.path;
  let localImportNames = [];

  root.find(j.ImportDeclaration).forEach((i) => {
    localImportNames = localImportNames.concat(
      i.value.specifiers.map((s) => s.local?.name).filter(Boolean),
    );
  });

  const styledImport = root.find(j.ImportDeclaration, {
    source: {
      value: "styled-components",
    },
  });

  if (!styledImport.length) {
    return;
  }

  // Find the methods that are being called.
  // check to see if we are importing css
  let styledLocal = styledImport.find(j.Identifier).get(0).node.name;

  const addUCLImport = (importName) =>
    registerUCLImportSpecifiers(root, j, importName);

  // other imports from styled-components
  // e.g. `css` `animate`
  const otherImports = styledImport
    .get(0)
    .node.specifiers.filter((p) => p.type === "ImportSpecifier")
    .map((p) => p.imported.name);

  if (otherImports.length) {
    otherImports.forEach((name) => {
      if (styledComponentImportFunctionShouldBeRemove(name)) {
        // Remove the export
        root
          .find(j.Identifier, { name: name })
          .closest(j.ExportNamedDeclaration)
          .remove();
        // Or the local var if there is no export
        root
          .find(j.Identifier, { name: name })
          .closest(j.VariableDeclaration)
          .remove();
        return;
      }

      root
        .find(j.TaggedTemplateExpression, {
          tag: {
            name: name,
          },
        })
        .forEach((nodePath) => {
          // This is for the styled-components `css`
          const expression = processElement({
            j,
            filePath,
            nodePath,
            activeElement: { to: "noop", from: "css" },
            addToImports: false,
            addToUCLImportsFn: _.noop,
            asObject: true,
            includeTypes: !isJSFile,
            localImportNames,
          });
          j(nodePath).replaceWith(expression);
        });
    });
  }

  // styled object, e.g.
  // styled.div`
  root
    .find(j.MemberExpression, {
      object: {
        name: styledLocal,
      },
    })
    .closest(j.TaggedTemplateExpression)
    .forEach((nodePath) => {
      // @ts-ignore
      const elementPropName = nodePath.node.tag.property.name;
      // styled.XXX
      // @ts-ignore
      const activeElement = getElementMapping(elementPropName);
      const expression = processElement({
        j,
        filePath,
        nodePath,
        activeElement,
        addToImports: true,
        addToUCLImportsFn: addUCLImport,
        includeTypes: !isJSFile,
        localImportNames,
      });
      j(nodePath).replaceWith(expression);
    });

  // styled CallExpressions, e.g.
  // styled(MyCustomComponent)
  root
    .find(j.CallExpression, {
      callee: {
        name: styledLocal,
      },
    })
    .closest(j.TaggedTemplateExpression)
    .forEach((nodePath) => {
      const { node } = nodePath;
      // @ts-ignore
      const nameOfArg = node.tag?.arguments[0]?.name;
      const expression = processElement({
        j,
        filePath,
        nodePath,
        activeElement: { to: nameOfArg, from: "noop" },
        addToImports: false,
        addToUCLImportsFn: addUCLImport,
        includeTypes: !isJSFile,
        localImportNames,
      });
      j(nodePath).replaceWith(expression);
    });

  // Imports
  // -------

  // Remove the 'styled-components' import
  if (otherImports.length) {
    let specifiers = styledImport.get(0).node.specifiers;
    specifiers = _.filter((s) => {
      // @ts-ignore
      if (s?.type === "ImportDefaultSpecifier") {
        return false;
      }
      // @ts-ignore
      if (styledComponentImportFunctionShouldBeRemove(s?.imported?.name)) {
        return false;
      }
      // @ts-ignore
      if (_.contains(s?.imported?.name, ["css"])) {
        return false;
      }
      return true;
    })(specifiers);
    if (!specifiers.length) {
      styledImport.remove();
    } else {
      styledImport.get(0).node.specifiers = specifiers;
    }
  } else {
    styledImport.remove();
  }
}
