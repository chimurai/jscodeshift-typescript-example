import {
  Collection,
  FileInfo,
  JSCodeshift,
  ObjectMethod,
  ObjectProperty,
  Property,
  SpreadElement,
  SpreadProperty,
} from "jscodeshift";
import _ from "lodash";
import { _isRemovable, _isSupported } from "../utils/mappings";
import { logManualWork, commitManualLogs } from "../../logger";
import { convertObjectProperties } from "./convert-object-properties";

export function transformInlineStyleProps(
  root: Collection<any>,
  j: JSCodeshift,
  file: FileInfo,
) {
  root.findJSXElements().forEach((node) => {
    const styleAttribute = node.value.openingElement.attributes.find(
      (a) => a.type === "JSXAttribute" && a.name.name === "style",
    );

    if (styleAttribute && styleAttribute.type === "JSXAttribute") {
      // This handles the case where the style attribute is an object
      if (
        styleAttribute.value.type === "JSXExpressionContainer" &&
        styleAttribute.value.expression.type === "ObjectExpression"
      ) {
        styleAttribute.value.expression.properties = convertObjectProperties(
          file.path,
          j,
          styleAttribute.value.expression.properties,
          needsFlexRemapping(styleAttribute.value.expression.properties),
        );
        return;
      }

      // when we have something like `style={styles.foo}`
      if (
        styleAttribute.value.type === "JSXExpressionContainer" &&
        styleAttribute.value.expression.type === "MemberExpression" &&
        styleAttribute.value.expression.object.type === "Identifier" &&
        styleAttribute.value.expression.property.type === "Identifier"
      ) {
        const objectName = styleAttribute.value.expression.object.name;
        const memberName = styleAttribute.value.expression.property.name;
        root.findVariableDeclarators(objectName).forEach((path) => {
          if (path.value.init.type === "ObjectExpression") {
            const node = path.value.init.properties.find(
              (p) =>
                p.type === "ObjectProperty" &&
                p.key.type === "Identifier" &&
                p.key.name === memberName,
            );

            if (
              node?.type === "ObjectProperty" &&
              node.value.type === "ObjectExpression"
            ) {
              node.value.properties = convertObjectProperties(
                file.path,
                j,
                node.value.properties,
                needsFlexRemapping(node.value.properties),
              );
            }
          }
        });

        return;
      }

      // when we have something like `style={styles}`
      if (
        styleAttribute.value.type === "JSXExpressionContainer" &&
        styleAttribute.value.expression.type === "Identifier"
      ) {
        const objectName = styleAttribute.value.expression.name;

        // Check to see if the object is a variable in the module scope
        // if not, we handle it below
        let foundVariables = false;

        root.findVariableDeclarators(objectName).forEach((path) => {
          foundVariables = true;
          if (path.value.init.type === "ObjectExpression") {
            const node = path.value.init;

            node.properties = convertObjectProperties(
              file.path,
              j,
              node.properties,
              needsFlexRemapping(node.properties),
            );
          }
        });

        if (!foundVariables) {
          const nodeName =
            node.value.openingElement.name.type === "JSXIdentifier"
              ? node.value.openingElement.name.name
              : // not sure what to do here for JSXMemberExpression and JSXNamespaced
                "UNKNOWN_NODE_NAME";

          logManualWork({
            filePath: file.path,
            helpfulMessage: `The JSX node <${nodeName} style={${objectName}}> has a style attribute that references a variable this is not modable.
The manual effort here is to track down the variable and verify/change all instances to ensure they are react native compatible.
  
For example, if the \`${objectName}\` variable is an import, follow the import (and its respective brand overrides), and verify all of the keys are react native compatible.
  
If the \`${objectName}\` variable is a prop coming in from the parent, find all usages of this component, and ensure the prop passed in is valid react native styles.`,
            startingLine: node.value.loc.start.line,
            endingLine: node.value.loc.end.line,
          });
        }

        return;
      }

      // This is for style={[ any ]}, which only happens in react native. so its safe to ignore
      if (
        styleAttribute.value.type === "JSXExpressionContainer" &&
        styleAttribute.value.expression.type === "ArrayExpression"
      )
        return;

      console.error(
        "Not sure how to handle this `style` attribute with AST type of ",
        styleAttribute.value.type,
      );
    }
  });
}

// only needs to remap if the node had flex, but did not have a flex direction,
// meaning that the flex direction is going to be implicitly flipped by switching to react-native
const needsFlexRemapping = (
  properties: (
    | Property
    | ObjectProperty
    | SpreadElement
    | SpreadProperty
    | ObjectMethod
  )[],
) => {
  const hasFlex = properties.some(
    (node) =>
      node.type === "ObjectProperty" &&
      node.key.type === "Identifier" &&
      node.key.name === "display" &&
      node.value.type === "StringLiteral" &&
      node.value.value === "flex",
  );

  const hasFlexDirection = properties.some(
    (node) =>
      node.type === "ObjectProperty" &&
      node.key.type === "Identifier" &&
      node.key.name === "flexDirection",
  );

  return hasFlex && !hasFlexDirection;
};
