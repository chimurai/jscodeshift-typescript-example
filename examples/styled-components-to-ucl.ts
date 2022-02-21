import { API, FileInfo, JSCodeshift } from 'jscodeshift';

const mappings = {
  'div': {
    import: 'Box',
  },
  'h1': {
    import: 'Header'
  }
};

const styledToUCL = (j: JSCodeshift, element: string, template: string) => {
  const found = mappings[element];

  if (!found) {
    throw new Error('element not found: ' + element);
  }

  // Check for props
  // Check media queries
  // Map to NB/RN
  const asObject = j.objectExpression([
    j.property(
      'init',
      j.identifier('foo'),
      j.literal('bar')
    )
  ]);
  // return j.callExpression(j.memberExpression(asObject, j.identifier('fn')), []);
  return j.callExpression(
    j.memberExpression(
      j.identifier('Box'),
      j.identifier('withConfig'),
    ), [asObject]);
  //   j.objectExpression([
  //     j.property(
  //       'init',
  //       j.identifier('foo'),
  //       j.literal('bar')
  //     )
  //   ]),
  // ));

  // ('init'), j.identifier('fo'), j.literal('bar'));
  // return j.callExpression(j.memberExpression(j.identifier('jest'), j.identifier('fn')), []);

}

export default function transformer(fileInfo: FileInfo, api: API) {
  const j = api.jscodeshift;

  const root = j(fileInfo.source);

  const styledImport = root
    .find(j.ImportDeclaration, {
      source: {
        value: 'styled-components'
      }
    });

  // other imports from styled-components
  // e.g. `css` `animate`
  const otherImports = styledImport.get(0).node.specifiers
    .filter(p => p.type === 'ImportSpecifier')
    .map(p => p.imported.name);


  console.log(`>>> otherImports: `, otherImports);
  if (otherImports.length) {

  }

  // Find the methods that are being called.

  // Collect deps
  // const elementsUsed = [];

  // check to see if we are importing css
  let styledLocal = styledImport.find(j.Identifier).get(0).node.name;

  console.log(`>>> styledLocal: `, styledLocal);

  // Imports
  // -------
  // Remove the styled import
  styledImport.remove();

  // Replace Import with UCL
  styledImport.insertBefore(j.importDeclaration(
    [
      j.importSpecifier(
        j.identifier('Box'),
      )
    ],
    j.stringLiteral("@rbilabs/universal-components")

  ))

  const callSite = root.find(j.MemberExpression, {
    object: {
      name: styledLocal,
    },
  })
    // .forEach((nodePath) => {
    //   const { node } = nodePath;
    //   console.log(`node: `, node);
    //   // styled.XXX
    //   // @ts-ignore
    //   const htmlElement = node.property.name;
    //   // // do the mapping
    //   const obj = styledToUCL(j, htmlElement, ``);
    //   // console.log(`>>> HTML element: `, obj);


    // })
    .closest(j.TaggedTemplateExpression)
    .replaceWith(nodePath => {
      const { node } = nodePath;
      console.log(`node: `, node);
      // styled.XXX
      // @ts-ignore
      // const htmlElement = node.property.name;
      const htmlElement = 'div';
      // // do the mapping
      const obj = styledToUCL(j, htmlElement, ``);

      return obj;
    });

  return root.find(j.MemberExpression, {
    object: {
      name: styledLocal,
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
