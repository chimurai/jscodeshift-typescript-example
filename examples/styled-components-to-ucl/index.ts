import { API, FileInfo, JSCodeshift } from 'jscodeshift';
import {
  getElementMapping,
  isATextProp,
  mediaPropertyNames,
  parseExpression,
  postToRNTransform,
  preToRNTransform,
} from './utils';
import * as _ from 'lodash/fp';
import * as postcss from "postcss-scss";
import * as postcssJs from "postcss-js";
import toRN from "css-to-react-native";
import { forEach } from 'lodash';

const TODO_RN_COMMENT = `TODO RN: unsupported CSS`;

const tagTypes = {
  Identifier: node => node,
  CallExpression: node => node.callee,
  MemberExpression: node => node.object,
};

const styledComponentsImportsToRemove = ['keyframes'];

export const parser = 'tsx'
export default function transformer(fileInfo: FileInfo, api: API) {
  const j = api.jscodeshift;

  const root = j(fileInfo.source);
  const uclImports = [];
  const localVariable = [];

  // Add all local variables
  // @ts-ignore
  root.findVariableDeclarators().forEach(d => localVariable.push(d.value.id.name));

  const addUCLImport = (componentRealName) => {
    // Prefix with UCL if there is a local variable with the same name
    let name = componentRealName;
    let alias = undefined;
    if (_.includes(name, localVariable)) {
      alias = 'UCL' + name;
    }
    uclImports.push([name, alias]);
    return alias ? alias : name;
  }

  const styledImport = root
    .find(j.ImportDeclaration, {
      source: {
        value: 'styled-components'
      }
    });

  if (!styledImport.length) {
    return;
  }

  // Find the methods that are being called.
  // check to see if we are importing css
  let styledLocal = styledImport.find(j.Identifier).get(0).node.name;

  // other imports from styled-components
  // e.g. `css` `animate`
  const otherImports = styledImport.get(0).node.specifiers
    .filter(p => p.type === 'ImportSpecifier')
    .map(p => p.imported.name);

  if (otherImports.length) {
    otherImports.forEach(name => {
      if (_.contains(name, styledComponentsImportsToRemove)) {
        // Remove the export
        root.find(j.Identifier, { name: name, }).closest(j.ExportNamedDeclaration).remove();
        // Or the local var if there is no export
        root.find(j.Identifier, { name: name, }).closest(j.VariableDeclaration).remove();
        return;
      }

      root.find(j.TaggedTemplateExpression, {
        tag: {
          name: name,
        },
      })
        .forEach(nodePath => {
          const expression = processElement({
            j,
            nodePath,
            activeElement: { component: 'noop' },
            addToImports: false,
            addToUCLImportsFn: _.noop,
            asObject: true,
          });
          j(nodePath).replaceWith(expression);
        });
    })
  }

  root.find(j.MemberExpression, {
    object: {
      name: styledLocal,
    },
  })
    .closest(j.TaggedTemplateExpression)
    .forEach(nodePath => {
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
      });
      j(nodePath).replaceWith(expression);
    });

  root.find(j.CallExpression, {
    callee: {
      name: styledLocal,
    }
  })
    .closest(j.TaggedTemplateExpression)
    .forEach(nodePath => {
      const { node } = nodePath;
      // @ts-ignore
      const nameOfArg = node.tag?.arguments[0]?.name;
      const expression = processElement({
        j,
        nodePath,
        activeElement: { component: nameOfArg },
        addToImports: false,
        addToUCLImportsFn: addUCLImport,
      });
      j(nodePath).replaceWith(expression);
    });

  // Imports
  // -------

  // Remove the 'styled-components' import
  if (otherImports.length) {
    let specifiers = styledImport.get(0).node.specifiers;
    specifiers = _.filter(s => {
      // @ts-ignore
      if (s?.type === 'ImportDefaultSpecifier') {
        return false;
      }
      // @ts-ignore
      if (_.contains(s?.imported?.name, styledComponentsImportsToRemove)) {
        return false;
      }
      // @ts-ignore
      if (_.contains(s?.imported?.name, ['css'])) {
        return false;
      }
      return true;
    }
    )(specifiers);
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
    styledImport.insertBefore(j.importDeclaration(
      // All imports on the page
      _.flow(
        // dedupe
        // First item in the tuple
        _.uniqBy((arr) => arr[0]),
        _.map((obj: Array<string>) => j.importSpecifier(
          j.identifier(obj[0]),
          obj[1] ? j.identifier(obj[1]) : null,
        )),
        _.values,
      )(uclImports),
      j.stringLiteral("@rbilabs/universal-components")
    ))
  }

  return root.toSource({ quote: 'single', trailingComma: true });
};

const processElement = ({
  j,
  nodePath,
  activeElement,
  addToImports,
  addToUCLImportsFn,
  asObject = false,
}: {
  j: JSCodeshift,
  nodePath: any,
  activeElement: any,
  addToImports: boolean,
  addToUCLImportsFn: Function,
  asObject?: boolean,
}) => {
  const componentNameOrAlias = addToImports
    ? addToUCLImportsFn(activeElement.component)
    : activeElement.component;

  const { quasi, tag } = nodePath.node;
  const { obj, cssText, substitutionMap, comments } = parseTemplate({ quasi, tag });

  let properties = [];
  let localVars = [];
  let hasExpressionError = false;
  const addToLocalVars = (v) => localVars.push(v);

  _.map((key: string) => {
    let value = obj[key];
    // Nested objects as values
    if (_.isObject(value)) {
      // Supported properties that can have objects as key
      if (key === '&:hover') {
        _.map((k: string) => {
          let v = value[k];
          try {
            const {
              identifier,
              isRemovable,
              isSupported,
              isSkipable,
              value,
            } = preToRNTransform(k, v);
            k = identifier;
            v = value;
            if (isRemovable) {
              return;
            }
            if (!isSupported) {
              properties = addProperty(j, properties, k, v, isSupported);
              return;
            }
            let convertedObj
            if (isSkipable) {
              convertedObj = { [k]: v };
            } else {
              convertedObj = toRN([[k, v]]);
            }
            _.keys(convertedObj).forEach((k) => {
              const v = convertedObj[k];
              properties = addProperties({
                j,
                properties,
                substitutionMap,
                addToLocalVars,
                identifier: k,
                initialValue: v,
                parent: '_hover',
                newPropertyName: null,
                originalPropertyNewName: null,
                needsFlexRemapping: needsFlexRemapping(value),
              })
            });
          } catch (error) {
            console.error('toRN', error.message);
            hasExpressionError = true;
          }
        })(_.keys(value))
        // Unsupported
      } else {
        hasExpressionError = true;
      }
      return;
    }

    let parent = null;

    const {
      identifier,
      isRemovable,
      isSupported,
      isSkipable,
      value: _value,
    } = preToRNTransform(key, value);
    key = identifier;
    value = _value;

    // if the element is a box we have to next the text properties under _text
    if (activeElement.component === 'Box' && isATextProp(key)) {
      parent = '_text';
    }

    if (isRemovable) {
      return;
    }
    if (!isSupported) {
      properties = addProperty(j, properties, key, value, isSupported);
      return;
    }

    try {
      let convertedObj
      if (isSkipable) {
        convertedObj = { [key]: value };
      } else {
        convertedObj = toRN([[key, value]]);
      }
      _.keys(convertedObj).forEach((k) => {
        const v = convertedObj[k];
        properties = addProperties({
          j,
          properties,
          substitutionMap,
          addToLocalVars,
          identifier: k,
          initialValue: v,
          parent: parent,
          newPropertyName: null,
          originalPropertyNewName: null,
          needsFlexRemapping: needsFlexRemapping(obj),
        })
      });

    } catch (error) {
      console.error('toRN', error.message);
      hasExpressionError = true;
      return;
    }
  })(_.keys(obj));

  if (comments.length) {
    comments.forEach((c, i) => {
      // Expressions at the property level will appear as comments
      const exp = substitutionMap[`/*${c.text}*/`];
      if (exp) {
        // is the expression is an variable, spread it.
        // @ts-ignore
        if (exp.type === 'Identifier') {
          properties = [
            ...properties,
            // @ts-ignore
            j.spreadElement(j.identifier(exp.name)),
          ];
        }

        // @ts-ignore
        const { obj, substitutionMap } = parseTemplate({ quasi: exp.quasi, tag: exp.tag });
        if (!obj) return;

        _.keys(obj).forEach((k) => {
          let v = obj[k];
          // In the case media queries we want to turn the property into
          // an object, so the parent is the original key, e.g. `margin:`
          // const parent = k;
          // Set the new key based on the media query
          // @ts-ignore
          const queryName = exp.tag.property.name;
          // e.g. `mobile` `desktop`
          const { origProp, newProp } = mediaPropertyNames[queryName];
          if (!origProp) {
            return;
          }
          const {
            identifier,
            isRemovable,
            isSupported,
            isSkipable,
            value,
          } = preToRNTransform(k, v);
          k = identifier;
          v = value;
          if (isRemovable) {
            return;
          }
          if (!isSupported) {
            properties = addProperty(j, properties, k, v, isSupported);
            return;
          }

          // Convert
          try {
            let convertedObj;
            if (isSkipable) {
              convertedObj = { [k]: v };
            } else {
              convertedObj = toRN([[k, v]]);
            }
            _.keys(convertedObj).forEach((k) => {
              const v = convertedObj[k];
              properties = addProperties({
                j,
                properties,
                substitutionMap,
                addToLocalVars,
                identifier: k,
                initialValue: v,
                parent: k,
                newPropertyName: newProp,
                originalPropertyNewName: origProp,
                needsFlexRemapping: needsFlexRemapping(obj),
              })
            });
          } catch (error) {
            console.error('toRN', error.message);
            hasExpressionError = true;
          }
        });
        // Return so that comment is not added to the object
        return;
      }

      // Get the position adjusted for the fact that
      // comments have been removed from the `properties` array
      const position = c.position - i;
      // Check to see if there is a comment at this lin
      const p = properties[position];
      const comment = c.text.indexOf("\n") >= 0
        ? j.commentBlock(' ' + c.text + '\n', true, true)
        : j.commentLine(' ' + c.text, true);
      if (p) {
        p.comments = [comment];
      }
    })
  }

  let asObjectOrFunction;

  if (localVars.length) {
    asObjectOrFunction = j.arrowFunctionExpression(
      [j.identifier('p')],
      j.parenthesizedExpression(j.objectExpression(properties)),
      false,
    );
  } else {
    asObjectOrFunction = j.objectExpression(properties);
  }

  let exprs;

  if (asObject) {
    exprs = asObjectOrFunction;
  } else {
    exprs = j.callExpression(
      j.memberExpression(
        j.identifier(componentNameOrAlias),
        j.identifier('withConfig'),
      ),
      [asObjectOrFunction],
    );
  }

  if (hasExpressionError) {
    let ct = cssText;
    _.map(((k: string) => {
      try {
        // Try to get a nice string
        ct = nodePathToString(nodePath);
      } catch (error) {
        // But fall back
      }
    }))(
      _.keys(substitutionMap)
    )
    exprs.comments = [j.commentBlock(`
${TODO_RN_COMMENT}
Some attributes were not converted.

${ct}
`, false, true)];
  }

  // Map Types
  if (localVars.length) {
    // Add types
    // @ts-ignore
    exprs.typeArguments = j.tsTypeParameterInstantiation([
      j.tsTypeLiteral(
        _.flow(
          _.flatten,
          _.uniqBy('name'),
          _.map((v: any) => j.tsPropertySignature(
            j.identifier(v.name),
            j.tsTypeAnnotation(v.type),
          ))
        )(localVars)
      ),
    ]);
  }
  return exprs;
}

const needsFlexRemapping = (obj) => obj.display === 'flex' && !obj.flexDirection;

const parseTemplate = ({ quasi, tag }) => {
  // Nested expressions
  if (!tag?.type) return {};

  if (!(tag.type in tagTypes)) return {};

  // Get the identifier for styled in either styled.View`...` or styled(View)`...`
  // Note we aren't checking the name of the callee
  const callee = tagTypes[tag.type](tag);

  if (callee.type !== 'Identifier') return;

  const { quasis, expressions } = quasi;
  // Substitute all ${interpolations} with arbitrary test that we can find later
  // This is so we can shove it in postCSS
  const substitutionNames = expressions.map((_value, index) => `/*__${index}substitution__*/`);
  let cssText =
    quasis[0].value.cooked +
    substitutionNames.map((name, index) => name + quasis[index + 1].value.cooked).join('');
  // @ts-ignore
  let substitutionMap = _.fromPairs(_.zip(substitutionNames, expressions));

  // Replace mixin interpolations as comments, but as ids if in properties
  let root = postcss.parse(cssText, {
    map: { annotation: false }
  });

  const comments = [];
  const notInPropertiesIndexes = {};
  root.walkComments((comment, position) => {
    comments.push({ text: comment.text, position });
    const index = substitutionNames.indexOf(`/*${comment.text}*/`);
    if (index >= 0) notInPropertiesIndexes[index] = true;
  });

  substitutionNames.forEach((name, index) => {
    if (!notInPropertiesIndexes[index]) substitutionNames[index] = name.replace(/^\/\*(.+)\*\/$/, '$1');
  });
  cssText =
    quasis[0].value.cooked +
    substitutionNames.map((name, index) => name + quasis[index + 1].value.cooked).join('');
  // @ts-ignore
  substitutionMap = _.fromPairs(_.zip(substitutionNames, expressions));

  root = postcss.parse(cssText);

  const obj = postcssJs.objectify(root);
  return {
    cssText,
    obj,
    substitutionMap,
    comments,
  }
}

const addProperties = ({
  j,
  properties,
  substitutionMap,
  addToLocalVars,
  identifier,
  initialValue,
  parent,
  newPropertyName,
  originalPropertyNewName,
  needsFlexRemapping,
}) => {
  let value = initialValue;
  // If the value is is an expression
  const foundExpression = substitutionMap[value];

  if (foundExpression) {
    const parsed = parseExpression(j, foundExpression);

    value = parsed.value;
    // These are variables that are used in Arrow functions
    if (parsed.vars?.length) {
      addToLocalVars(parsed.vars);
    }
  } else {
    value = j.literal(initialValue);
  }

  const {
    identifier: _identifier,
    value: _value,
    isSupported,
    isRemovable,
  } = postToRNTransform(identifier, value.value, needsFlexRemapping);

  value.value = _value;
  identifier = _identifier;

  // Things like `animation` we don't want to include at all so just return early
  if (isRemovable) {
    return properties;
  }

  // Change property name if this going to be an attribute of a nested object
  if (parent && newPropertyName) {
    identifier = newPropertyName;
  }

  // Comment the others
  if (!isSupported) {
    identifier = '// ' + identifier;
  }
  const builderProperty = j.property(
    'init',
    j.identifier(identifier),
    value,
  );

  if (!isSupported) {
    // Add comment
    builderProperty.comments = [j.commentLine(' ' + TODO_RN_COMMENT, true)];
  }
  if (parent) {
    // find the parent
    // @ts-ignore
    const found = _.find(p => p?.key?.name === parent)(properties);
    if (found) {
      // Confirm that property is an object
      // @ts-ignore
      if (found.value.properties) {
        // If it is; just push to the properties
        // @ts-ignore
        found.value.properties.push(builderProperty);
      } else {
        // In not an object, convert to an object
        // @ts-ignore
        const originalValue = found.value;
        // Remove
        // @ts-ignore
        properties = _.remove(p => p?.key?.name === parent)(properties)

        const originalProperty = j.property(
          'init',
          j.identifier(originalPropertyNewName),
          originalValue,
        );
        // Change the property name
        builderProperty.key.name = newPropertyName;
        properties.push(j.property(
          'init',
          j.identifier(parent),
          j.objectExpression([
            originalProperty,
            builderProperty,
          ]),
        ));
      }
      return properties;
    } else {
      // Create a new object with the parent as the key
      properties.push(j.property(
        'init',
        j.identifier(parent),
        j.objectExpression([builderProperty]),
      ));
      return properties;
    }
  } else {
    properties.push(builderProperty);
    return properties;
  }
}

const addProperty = (j: JSCodeshift, properties, identifier, value, isSupported) => {
  const prefix = !isSupported ? `// ${TODO_RN_COMMENT}\n// ` : '';
  return [
    ...properties,
    j.property(
      'init',
      j.identifier(prefix + identifier),
      j.literal(value),
    )
  ]
}

const nodePathToString = (nodePath) => {
  if (nodePath?.node?.loc) {
    try {
      const start = nodePath?.node?.loc?.start?.line - 1;
      const end = nodePath?.node?.loc?.end?.line + 1;
      const str = _.flow(
        _.slice(start, end),
        // @ts-ignore
        _.map(o => o?.line),
        _.map((o: string) => _.flow(
          _.replace('/*', '//'),
          _.replace('*/', '')
        )(o)),
        _.join('\n'),
      )(nodePath?.node?.loc?.lines?.infos);
      return str;
    } catch (error) {
      throw new Error(`nodePathToString error`)
    }
  }
  return 'And error occurred';
}
