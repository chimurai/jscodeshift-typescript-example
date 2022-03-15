import { API, FileInfo, ObjectProperty } from "jscodeshift";
import _ from "lodash";
import toRN from "css-to-react-native";
import {
  _isRemovable,
  _isSupported,
} from "../../examples/styled-components-to-ucl/utils";
import { convertObjectProperties } from "./convert-object-properties";

export const parser = "tsx";
export default function transformer(file: FileInfo, api: API) {
  const j = api.jscodeshift;
  const root = j(file.source);

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
        root.findVariableDeclarators(objectName).forEach((path) => {
          if (path.value.init.type === "ObjectExpression") {
            const node = path.value.init;

            node.properties = convertObjectProperties(
              j,
              node.properties,
              needsFlexRemapping(node.properties),
            );
          }
        });

        return;
      }

      // console.error(
      //   "Not sure how to handle this `style` attribute with AST type of ",
      //   styleAttribute.value.type,
      // );
    }
  });

  return root.toSource({ quote: "single" });
}

const needsFlexRemapping = (properties: any) =>
  properties.some(
    (node) =>
      // @ts-ignore
      node.key.name === "display" && node.value.value === "flex",
  );
