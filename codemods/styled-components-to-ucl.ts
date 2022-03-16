import { API, FileInfo } from "jscodeshift";
import {
  getElementMapping,
  styledComponentImportFunctionShouldBeRemove,
} from "./utils/mappings";
import { processElement } from "./utils/process-element";
import * as _ from "lodash/fp";

export const parser = "tsx";
export default function transformer(fileInfo: FileInfo, api: API) {
  const j = api.jscodeshift;

  const root = j(fileInfo.source);

  const isJSFile = fileInfo.path.endsWith(".js");
  const uclImports = [];
  const localVariable = [];
  let localImportNames = [];

  root.find(j.ImportDeclaration).forEach((i) => {
    // @ts-ignore
    localImportNames = localImportNames.concat(
      i.value.specifiers.map((s) => s.local.name),
    );
  });

  // Add all local variables
  root
    .findVariableDeclarators()
    // @ts-ignore
    .forEach((d) => localVariable.push(d.value.id.name));

  const addUCLImport = (componentRealName) => {
    // Prefix with UCL if there is a local variable with the same name
    let name = componentRealName;
    let alias = undefined;
    if (_.includes(name, _.concat(localVariable, localImportNames))) {
      alias = "UCL" + name;
    }
    uclImports.push([name, alias]);
    return alias ? alias : name;
  };

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
            nodePath,
            activeElement: { component: "noop" },
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
        nodePath,
        activeElement,
        addToImports: true,
        addToUCLImportsFn: addUCLImport,
        includeTypes: !isJSFile,
        localImportNames,
      });
      j(nodePath).replaceWith(expression);
    });

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
        nodePath,
        activeElement: { component: nameOfArg },
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

  // Replace Import with UCL
  if (_.keys(uclImports).length) {
    styledImport.insertBefore(
      j.importDeclaration(
        // All imports on the page
        _.flow(
          // dedupe
          // First item in the tuple
          _.uniqBy((arr) => arr[0]),
          _.map((obj: Array<string>) =>
            j.importSpecifier(
              j.identifier(obj[0]),
              obj[1] ? j.identifier(obj[1]) : null,
            ),
          ),
          _.values,
        )(uclImports),
        j.stringLiteral("@rbilabs/universal-components"),
      ),
    );
  }

  return root.toSource({ quote: "single", trailingComma: true });
}
