import { API, FileInfo, JSCodeshift } from 'jscodeshift';
import * as _ from 'lodash';

interface IMapping {
  component: string;
}

export const SpreadContentContainer = `
  font-size: 1.1rem;
  text-align: center;
`;

const mappings: Record<string, IMapping> = {
  'div': {
    component: 'Box',
  },
  'h1': {
    component: 'Header'
  },
  'h2': {
    component: 'Header'
  }
};

const tagTypes = {
  Identifier: node => node,
  CallExpression: node => node.callee,
  MemberExpression: node => node.object,
};


const getMapping = (el: string) => {
  const found = mappings[el];

  if (!found) {
    throw new Error('element not found: ' + el);
  }
  return found;
}

const styledToUCL = (j: JSCodeshift, mapping, template: string) => {
  const Component = mapping.component;

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
  // return toRN(SpreadContentContainer);
  return j.callExpression(
    j.memberExpression(
      j.identifier(Component),
      j.identifier('withConfig'),
    ), [asObject]);
}

export default function transformer(fileInfo: FileInfo, api: API) {
  const j = api.jscodeshift;

  const root = j(fileInfo.source);
  const uclImports = [];

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


  // console.log(`>>> otherImports: `, otherImports);
  if (otherImports.length) {

  }

  // Find the methods that are being called.

  // Collect deps
  // const elementsUsed = [];

  // check to see if we are importing css
  let styledLocal = styledImport.find(j.Identifier).get(0).node.name;

  // console.log(`>>> styledLocal: `, styledLocal);

  root.find(j.MemberExpression, {
    object: {
      name: styledLocal,
    },
  })
    .closest(j.TaggedTemplateExpression)
    .replaceWith(nodePath => {
      const { node } = nodePath;
      // const text = node.quasi.quasis[0].value.raw;

      // @ts-ignore
      // console.log(`-----: `, node.quasi.quasis.map(v => v));
      // console.log(`-----: `, node);
      // console.log(`-----: `, text);
      // console.log(`-----: `, node.template);
      // console.log(`-----: `, text);
      // console.log(`-----: `, node.tag.property.name);

      // @ts-ignore
      const propName = node.tag.property.name;
      // styled.XXX
      // @ts-ignore
      // const htmlElement = node.property.name;
      const mapping = getMapping(propName);
      // console.log(`>>> mapping: `, mapping);
      if (mapping?.component)
        uclImports.push(mapping.component)
      // // do the mapping
      const obj = styledToUCL(j, mapping, ``);

      return obj;
    });

  // console.log(`>>> uclImports: `, uclImports);
  // Imports
  // -------
  // Remove the 'styled-components' import
  styledImport.remove();

  // Replace Import with UCL
  styledImport.insertBefore(j.importDeclaration(
    // All imports on the page
    _(uclImports)
      // dedupe
      .uniq()
      // sort
      .orderBy()
      .map(name =>
        j.importSpecifier(
          j.identifier(name),
        )).value(),
    j.stringLiteral("@rbilabs/universal-components")
  ))

  return root.toSource({ quote: 'single' });
};
