import { API, FileInfo } from 'jscodeshift';

export default function transformer(fileInfo: FileInfo, api: API) {
  const j = api.jscodeshift;

  const root = j(fileInfo.source);

  // find declaration for "geometry" import
  // const importDeclaration = root.find(j.ImportSpecifier);

  const styledImport = root
    .find(j.ImportDeclaration, {
      source: {
        value: 'styled-components'
      }
    })

  // .filter((path) => {
  styledImport.insertAfter(j.importDeclaration(
    [
      j.importSpecifier(
        j.identifier('Box'),
      )
    ],
    j.stringLiteral("@rbilabs/universal-components")

  ))
  styledImport.remove();
  // console.log(`>>>>> styledImport: `, styledImport.);

  //   return path.parent.value.source.value === "styled-components";
  // });
  // .filter((path) => path.value.imported.name === "queryCache")
  // .remove();
  // console.log(`>>> specifiers: `, specifiers);
  //   source: { type: 'Literal',
  //     value: 'styled-components',
  //   },
  // });

  // get the local name for the imported module
  const localName = 'none'
  // find the Identifiers
  // importDeclaration.find(j.Identifier).length && importDeclaration.find(j.Identifier).get(0)?.node.name;
  // console.log(`>>>>>>>>>>>>>> importDeclaration.find(j.Identifier): `, importDeclaration.find(j.Identifier).nodes[0]);
  return root.find(j.MemberExpression, {
    object: {
      name: localName,
    },
    property: {
      name: 'circleArea',
    },
  }).replaceWith(nodePath => {
    // get the underlying Node
    const { node } = nodePath;

    // change to our new prop
    // @ts-ignore
    node.property.name = 'getCircleArea';
    // replaceWith should return a Node, not a NodePath
    return node;
  }).toSource({ quote: 'single' });
};
