import { API, FileInfo, JSCodeshift } from 'jscodeshift';
import { parseExpression, getElementMapping, isSupported, isATextProp, mediaPropertyNames } from './utils';
import * as _ from 'lodash/fp';
import * as postcss from "postcss-scss";
import * as postcssJs from "postcss-js";
import toRN from "css-to-react-native";

const TODO_RN_COMMENT = `TODO RN: unsupported CSS`;
const ERR_NO_STYLED_COMPONENT_IMPORT = `ERR_NO_STYLED_COMPONENT_IMPORT`;

const tagTypes = {
  Identifier: node => node,
  CallExpression: node => node.callee,
  MemberExpression: node => node.object,
};

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
    // const msg = ERR_NO_STYLED_COMPONENT_IMPORT;
    // throw new Error(msg);
    return;
  }

  // other imports from styled-components
  // e.g. `css` `animate`
  const otherImports = styledImport.get(0).node.specifiers
    .filter(p => p.type === 'ImportSpecifier')
    .map(p => p.imported.name);


  if (otherImports.length) {

  }

  // Find the methods that are being called.

  // Collect deps
  // const elementsUsed = [];

  // check to see if we are importing css
  let styledLocal = styledImport.find(j.Identifier).get(0).node.name;

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
      processElement(j, nodePath, activeElement, true, addUCLImport);
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
      processElement(j, nodePath, { component: nameOfArg }, false, addUCLImport);
    });

  // Imports
  // -------
  // Remove the 'styled-components' import
  styledImport.remove();

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

const processElement = (j: JSCodeshift, nodePath, activeElement, addToImports, addToUCLImportsFn) => {
  const componentNameOrAlias = addToImports
    ? addToUCLImportsFn(activeElement.component)
    : activeElement.component;

  const { quasi, tag } = nodePath.node
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
            const o = preToRNTransform(k, v);
            if (!o.isSupported) {
              properties = addUnsupportedProperty(j, properties, k, v);
              return;
            }
            k = o.key;
            v = o.value;
            const convertedObj = toRN([[k, v]]);
            _.keys(convertedObj).forEach((k) => {
              const v = convertedObj[k];
              properties = addProperties({
                j,
                properties,
                substitutionMap,
                addToLocalVars,
                property: k,
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
    // if the element is a box we have to next the text properties under _text
    if (activeElement.component === 'Box' && isATextProp(key)) {
      parent = '_text';
    }

    const o = preToRNTransform(key, value);
    if (!o.isSupported) {
      properties = addUnsupportedProperty(j, properties, key, value);
      return;
    }
    key = o.key;
    value = o.value;

    try {
      const convertedObj = toRN([[key, value]]);
      _.keys(convertedObj).forEach((k) => {
        const v = convertedObj[k];
        properties = addProperties({
          j,
          properties,
          substitutionMap,
          addToLocalVars,
          property: k,
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
        // @ts-ignore
        // if (!(exp.tag || exp.quasi)) {
        //   console.log(`exp: `, exp);
        //   hasExpressionError = true;
        //   return;
        // }
        // @ts-ignore
        const { obj, substitutionMap } = parseTemplate({ quasi: exp.quasi, tag: exp.tag });
        _.keys(obj).forEach((k) => {
          let v = obj[k];
          // In the case media queries we want to turn the property into
          // an object, so the parent is the original key, e.g. `margin:`
          const parent = k;
          // Set the new key based on the media query
          // @ts-ignore
          const queryName = exp.tag.property.name;
          // e.g. `mobile` `desktop`
          const { origProp, newProp } = mediaPropertyNames[queryName];
          if (!origProp) {
            return;
          }

          // One-offs Pre toRN
          // -------
          // @todo DRY

          const o = preToRNTransform(k, v);
          if (!o.isSupported) {
            properties = addUnsupportedProperty(j, properties, k, v);
            return;
          }
          k = o.key;
          v = o.value;
          // Convert
          try {
            const convertedObj = toRN([[k, v]]);
            _.keys(convertedObj).forEach((k) => {
              const v = convertedObj[k];
              properties = addProperties({
                j,
                properties,
                substitutionMap,
                addToLocalVars,
                property: k,
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

  const exprs = j.callExpression(
    j.memberExpression(
      j.identifier(componentNameOrAlias),
      j.identifier('withConfig'),
    ),
    [asObjectOrFunction],
  );

  if (hasExpressionError) {
    let ct = cssText;
    _.map(((k: string) => {
      ct = ct.replace(k, '!EXPRESSION!')
    }))(
      _.keys(substitutionMap)
    )
    exprs.comments = [j.commentBlock(`
${TODO_RN_COMMENT}

Some attributes couldn't be converted
Please use git history to get the exact values
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
  j(nodePath).replaceWith(exprs);
  return;
}

const needsFlexRemapping = (obj) => obj.display === 'flex' && !obj.flexDirection;

const parseTemplate = ({ quasi, tag }) => {
  if (!(tag.type in tagTypes)) return;

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
  property,
  initialValue,
  parent,
  newPropertyName,
  originalPropertyNewName,
  needsFlexRemapping,
}) => {
  let identifier = property;
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

  // One-offs Post toRN
  // -------
  if (identifier === 'font') {
    // The correct variant is set in utils/parseExpression
    identifier = 'variant';
  }

  if (needsFlexRemapping) {
    switch (identifier) {
      case 'justifyContent':
        identifier = 'alignItems';
        break;
      case 'alignItems':
        identifier = 'justifyContent';
        break;
    }
  }
  // ------

  const [supported, shouldRemove] = isSupported(identifier, value?.value);

  // Things like `animation` we don't want to include at all so just return early
  if (shouldRemove) {
    return properties;
  }

  if (parent && newPropertyName) {
    identifier = newPropertyName;
  }
  // Comment the others
  if (!supported) {
    identifier = '// ' + identifier;
  }
  const builderProperty = j.property(
    'init',
    j.identifier(identifier),
    value,
  );

  if (!supported) {
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

const addUnsupportedProperty = (j: JSCodeshift, properties, identifier, value) => {
  return [
    ...properties,
    j.property(
      'init',
      j.identifier(`// ${ERR_NO_STYLED_COMPONENT_IMPORT}\n// ` + identifier),
      j.literal(value),
    )
  ]
}

const preToRNTransform = (key, value) => {
  let k = key;
  let v = value;
  let isSupported = true;

  // One-offs Pre toRN
  // -------
  if (key === 'margin' && value?.includes('auto')) {
    k = 'align-self';
    v = 'center';
  }
  if (key === 'transform') {
    isSupported = false;
  }
  return {
    key: k,
    value: v,
    isSupported
  }
}
