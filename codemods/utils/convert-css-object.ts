import { JSCodeshift } from "jscodeshift";
import {
  checkForBetterMappingBasedOnProperties,
  IElementMapping,
  isATextProp,
  postToRNTransform,
  preToRNTransform,
} from "./mappings";

import { parseExpression } from "./parse-expression";
import * as _ from "lodash/fp";
import toRN from "css-to-react-native";

const TODO_RN_COMMENT = `TODO: RN - unsupported CSS`;
const SHOULD_THROW_ON_CONVERSION_ISSUES = false;
const SHOULD_THROW_ON_NESTED_OBJECT = false;

export const needsFlexRemapping = (obj) =>
  obj.display === "flex" && !obj.flexDirection;

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

  const addToLocalVars = (v) => localVars.push(v);

  // Check for better mapping. Clean object
  const {
    newMapping,
    newObject,
  } = checkForBetterMappingBasedOnProperties(activeElement, obj);
  obj = newObject;
  activeElement = newMapping;

  _.map((key: string) => {
    let value = obj[key];
    // Nested objects as values
    if (_.isObject(value)) {
      // Supported properties that can have objects as key
      if (key === "&:hover") {
        _.map((k: string) => {
          let v = value[k];
          let convertedObj;
          try {
            const { identifier, isRemovable, isSupported, isSkipable, value: _value } =
              preToRNTransform(k, v, value);
            k = identifier;
            v = _value;
            if (isRemovable) {
              return;
            }
            if (!isSupported) {
              properties = addProperty(j, properties, k, v, isSupported);
              return;
            }
            if (isSkipable) {
              convertedObj = { [k]: v };
            } else {
              convertedObj = toRN([[k, v]]);
            }
          } catch (error) {
            console.error("toRN", convertedObj, error.message);
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
            _.keys(convertedObj).forEach((k) => {
              const v = convertedObj[k];
              properties = addProperties({
                j,
                properties,
                substitutionMap,
                addToLocalVars,
                identifier: k,
                initialValue: v,
                parent: "_hover",
                newPropertyName: null,
                originalPropertyNewName: null,
                needsFlexRemapping: needsFlexRemapping(value),
                localImportNames,
              });
            });
          } catch (error) {
            console.error("addProperties", convertedObj, error.message);
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
          throw new Error("Contains object - " + value);
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
    if (
      isATextProp(key) &&
      _.includes(activeElement.to, ["Box", "Button"])
    ) {
      parent = "_text";
    }

    if (isRemovable) {
      return;
    }
    if (!isSupported) {
      properties = addProperty(j, properties, key, value, isSupported);
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
      console.error("toRN", convertedObj, key, value, error.message);
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
          localImportNames,
        });
      });
    } catch (error) {
      console.error("addProperties", convertedObj, error.message);
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
      properties = addProperty(j, properties, x.name, x.value, true, x.comment);
    })
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
  comment?: string,
) => {
  const prefix = !isSupported ? `// ${TODO_RN_COMMENT}\n// ` : "";
  const prop = j.property("init", j.identifier(prefix + identifier), j.literal(value));
  if (comment) {
    prop.comments = [
      j.commentLine(' ' + comment)
    ]
  }
  return [
    ...properties,
    prop,
  ];
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
}) => {
  let value = initialValue;
  let parent = _parent;
  let newPropertyName = _newPropertyName;

  // If the initialValue is an object, iterate over the keys
  if (_.isObject(initialValue)) {
    // Check for supported object properties
    // TODO

    // Set the parent to the
    parent = identifier;
    newPropertyName = value;
    let obj = value;
    _.keys(obj).forEach((k) => {
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
        needsFlexRemapping: needsFlexRemapping(obj),
        localImportNames,
      });
    });
    return properties;
  }

  // If the value is is an expression
  const foundExpression = substitutionMap[value];

  if (foundExpression) {
    const parsed = parseExpression(j, foundExpression, localImportNames);

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
  } = postToRNTransform(identifier, value.value, _needFlexRemapping);

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
    identifier = "// " + identifier;
  }
  const builderProperty = j.property("init", j.identifier(identifier), value);

  if (!isSupported) {
    // Add comment
    builderProperty.comments = [j.commentLine(" " + TODO_RN_COMMENT, true)];
  }
  if (parent) {
    // find the parent
    // @ts-ignore
    const found = _.find((p) => p?.key?.name === parent)(properties);
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
        properties = _.remove((p) => p?.key?.name === parent)(properties);

        const originalProperty = j.property(
          "init",
          j.identifier(originalPropertyNewName),
          originalValue,
        );
        // Change the property name
        builderProperty.key.name = newPropertyName;
        properties.push(
          j.property(
            "init",
            j.identifier(parent),
            j.objectExpression([originalProperty, builderProperty]),
          ),
        );
      }
      return properties;
    } else {
      // Create a new object with the parent as the key
      properties.push(
        j.property(
          "init",
          j.identifier(parent),
          j.objectExpression([builderProperty]),
        ),
      );
      return properties;
    }
  } else {
    properties.push(builderProperty);
    return properties;
  }
};
