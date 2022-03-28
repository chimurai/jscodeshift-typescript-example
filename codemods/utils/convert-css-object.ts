import { JSCodeshift } from 'jscodeshift';
import {
  IElementMapping,
  isATextProp,
  postToRNTransform,
  preToRNTransform,
  checkForBetterMappingBasedOnProperties,
  subRegEx,
} from './mappings';

import { parseExpression } from './parse-expression';
import * as _ from 'lodash/fp';
import toRN from '../css-to-react-native';

const TODO_RN_COMMENT = `TODO: RN - unsupported CSS`;
const SHOULD_THROW_ON_CONVERSION_ISSUES = false;
const SHOULD_THROW_ON_NESTED_OBJECT = false;

export const needsFlexRemapping = obj => obj.display === 'flex' && !obj.flexDirection;

interface IConvertCssObject {
  j: JSCodeshift;
  obj: Object;
  activeElement?: IElementMapping;
  substitutionMap?: Record<string, any>;
  localImportNames?: Array<string>;
}

export const convertCssObject = ({
  j,
  obj: _currentObj,
  activeElement: _activeElement,
  substitutionMap = {},
  localImportNames = [],
}: IConvertCssObject) => {
  let properties = [];
  let hasExpressionError = false;
  let obj = _currentObj;
  let activeElement = _activeElement;
  const localVars = [];

  const addToLocalVars = v => localVars.push(v);

  // Check for better mapping. Clean object
  const { newMapping, newObject } = checkForBetterMappingBasedOnProperties(activeElement, obj);
  obj = newObject;
  activeElement = newMapping;

  _.map((key: string) => {
    let value = obj[key];
    value = typeof value === 'string' ? value.replace(' !important', '') : value;
    // Nested objects as values
    if (_.isObject(value)) {
      // Supported properties that can have objects as key
      if (key === '&:hover') {
        _.map((k: string) => {
          let v = value[k];
          let convertedObj;
          try {
            const {
              identifier,
              isRemovable,
              isSupported,
              isSkipable,
              value: _value,
            } = preToRNTransform(k, v, value);
            k = identifier;
            v = _value;
            if (isRemovable) {
              return;
            }
            if (!isSupported && !isSkipable) {
              properties = addProperty(j, properties, k, v, isSupported, substitutionMap);
              return;
            }
            if (isSkipable) {
              convertedObj = { [k]: v };
            } else {
              convertedObj = toRN([[k, v]]);
            }
          } catch (error) {
            console.error('toRN', convertedObj, error.message);
            hasExpressionError = true;
            if (SHOULD_THROW_ON_CONVERSION_ISSUES) {
              throw error;
            }
          }
          try {
            // Run custom post processing
            if (activeElement.customPostProcessing) {
              convertedObj = activeElement.customPostProcessing(convertedObj);
            }
            _.keys(convertedObj).forEach(k => {
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
                localImportNames,
              });
            });
          } catch (error) {
            console.error('addProperties', convertedObj, error.message);
            hasExpressionError = true;
            if (SHOULD_THROW_ON_CONVERSION_ISSUES) {
              throw error;
            }
          }
        })(_.keys(value));
        // Unsupported
      } else {
        hasExpressionError = true;
        if (SHOULD_THROW_ON_NESTED_OBJECT) {
          throw new Error('Contains object - ' + value);
        }
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
    } = preToRNTransform(key, value, obj);
    key = identifier;
    value = _value;

    // TODO Move to post processing
    // if the element is a box we have to next the text properties under _text
    if (isATextProp(key) && _.includes(activeElement.to, ['Box', 'Button'])) {
      parent = '_text';
    }

    if (key === 'cursor') {
      parent = '_web';
    }

    if (isRemovable) {
      return;
    }
    if (!isSupported && !isSkipable) {
      properties = addProperty(j, properties, key, value, isSupported, substitutionMap);
      return;
    }

    let convertedObj;
    try {
      if (isSkipable) {
        convertedObj = { [key]: value };
      } else {
        convertedObj = toRN([[key, value]]);
      }
    } catch (error) {
      console.error('toRN', convertedObj, key, value, error.message);
      hasExpressionError = true;
      if (SHOULD_THROW_ON_CONVERSION_ISSUES) {
        throw error;
      }
      return;
    }
    try {
      // Run custom post processing
      if (activeElement.customPostProcessing) {
        convertedObj = activeElement.customPostProcessing(convertedObj);
      }
      _.keys(convertedObj).forEach(k => {
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
          localImportNames,
        });
      });
    } catch (error) {
      console.error('addProperties', convertedObj, error.message);
      hasExpressionError = true;
      if (SHOULD_THROW_ON_CONVERSION_ISSUES) {
        throw error;
      }
      return;
    }
  })(_.keys(obj));

  // Add the custom properties
  if (activeElement.attributes) {
    activeElement.attributes.forEach(x => {
      properties = addProperty(j, properties, x.name, x.value, true, substitutionMap, x.comment);
    });
  }

  // Remove duplicate keys
  properties = _.uniqBy('key.name')(properties);
  return {
    properties,
    localVars,
    hasExpressionError,
  };
};

export const addProperty = (
  j: JSCodeshift,
  properties,
  identifier,
  value,
  isSupported,
  substitutionMap,
  comment?: string
) => {
  let unsupportedComment = '';
  // replace substitution back into comment.
  function literalBasedOnSupported() {
    if (!isSupported) {
      const { foundExpression, pre, post } = getExpressionFromMap(substitutionMap, value);
      if (foundExpression) {
        const parsed = parseExpression(j, foundExpression, []);

        if (pre || post) {
          if (['rem', 'vw', 'vh', 'em'].includes(post)) {
            unsupportedComment = `\n// ${post} are not supported in the interpolated value`;
          }
          return j.templateLiteral(
            [
              j.templateElement({ cooked: pre, raw: pre }, false),
              j.templateElement({ cooked: post, raw: post }, false),
            ],
            [parsed.value]
          );
        }
      }
    }

    return j.literal(value);
  }

  const initValue = literalBasedOnSupported();
  const prefix = !isSupported ? `// ${TODO_RN_COMMENT}${unsupportedComment}\n// ` : '';
  const prop = j.property('init', j.identifier(prefix + identifier), initValue);
  if (comment) {
    prop.comments = [j.commentLine(' ' + comment)];
  }
  return [...properties, prop];
};

const getExpressionFromMap = (substitutionMap, value) => {
  // return substitutionMap[value];
  const p = String(value).match(subRegEx);
  // Not found
  if (!p?.groups?.sub) {
    return {
      foundExpression: null,
      pre: null,
      post: null,
    };
  }

  const pre = p?.groups?.pre;
  const post = p?.groups?.post;
  const foundExpressionKey = Object.keys(substitutionMap).find(key => {
    if (p.groups.sub === key) {
      return true;
    }
  });
  const foundExpression = substitutionMap[foundExpressionKey];
  return {
    foundExpression,
    pre,
    post,
  };
};

export const addProperties = ({
  j,
  properties,
  substitutionMap,
  addToLocalVars,
  identifier,
  initialValue,
  parent: _parent,
  newPropertyName: _newPropertyName,
  originalPropertyNewName,
  needsFlexRemapping: _needFlexRemapping,
  localImportNames,
}: {
  j: JSCodeshift;
  properties: any[];
  substitutionMap: any;
  addToLocalVars: Function;
  identifier: string;
  initialValue: any;
  parent?: string;
  newPropertyName?: string;
  originalPropertyNewName?: string;
  needsFlexRemapping?: boolean;
  localImportNames?: string[];
}) => {
  let value = initialValue;
  let parent = _parent;
  let newPropertyName = _newPropertyName;
  let commentError = null;

  if (!parent && _needFlexRemapping) {
    properties.push(j.property('init', j.identifier('flexDirection'), j.literal('row')));
  }

  // If the initialValue is an object, iterate over the keys
  if (_.isObject(initialValue)) {
    // Check for supported object properties
    // TODO

    // Set the parent to the
    parent = identifier;
    newPropertyName = value;
    let obj = value;
    _.keys(obj).forEach(k => {
      const v = obj[k];
      properties = addProperties({
        j,
        properties,
        substitutionMap,
        addToLocalVars,
        identifier: k,
        initialValue: v,
        parent: parent,
        newPropertyName: k,
        originalPropertyNewName: null,
        needsFlexRemapping: false,
        localImportNames,
      });
    });
    return properties;
  }

  // If the value is is an expression
  const { foundExpression, pre, post } = getExpressionFromMap(substitutionMap, value);
  if (foundExpression) {
    const parsed = parseExpression(j, foundExpression, localImportNames);

    value = parsed.value;
    if (pre || post) {
      if (['rem', 'vw', 'vh', 'em'].includes(post)) {
        commentError = `${post} are not supported in the interpolated value`;
      }
      value = j.templateLiteral(
        [
          j.templateElement({ cooked: pre, raw: pre }, false),
          j.templateElement({ cooked: post, raw: post }, false),
        ],
        [parsed.value]
      );
    }
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
  } = postToRNTransform(identifier, value.value);

  let isChangingIdentifier = identifier !== _identifier;
  value.value = _value;
  identifier = _identifier;

  // Things like `animation` we don't want to include at all so just return early
  if (isRemovable) {
    return properties;
  }

  // Change property name if this going to be an attribute of a nested object
  if (parent && newPropertyName && !isChangingIdentifier) {
    identifier = newPropertyName;
  }

  // Comment the others
  if (!isSupported || commentError) {
    identifier = '// ' + identifier;
  }
  const builderProperty = j.property('init', j.identifier(identifier), value);

  if (!isSupported || commentError) {
    // Add comment
    builderProperty.comments = [
      j.commentLine(' ' + TODO_RN_COMMENT, true),
      j.commentLine(' ' + commentError, true),
    ];
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
        properties = _.remove(p => p?.key?.name === parent)(properties);

        const originalProperty = j.property(
          'init',
          j.identifier(originalPropertyNewName),
          originalValue
        );
        // Change the property name
        // @ts-ignore
        builderProperty.key.name = newPropertyName;
        properties.push(
          j.property(
            'init',
            j.identifier(parent),
            j.objectExpression([originalProperty, builderProperty])
          )
        );
      }
      return properties;
    } else {
      // Create a new object with the parent as the key
      properties.push(
        j.property('init', j.identifier(parent), j.objectExpression([builderProperty]))
      );
      return properties;
    }
  } else {
    properties.push(builderProperty);
    return properties;
  }
};
