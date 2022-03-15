import {
  JSCodeshift,
  ObjectMethod,
  ObjectProperty,
  Property,
  SpreadElement,
  SpreadProperty,
} from "jscodeshift";
import toRN from "css-to-react-native";
import {
  _isRemovable,
  _isSupported,
} from "../../examples/styled-components-to-ucl/utils";
import { logManualWork } from "../../logger";

export function convertObjectProperties(
  filePath: string,
  j: JSCodeshift,
  properties: Array<
    Property | ObjectProperty | SpreadElement | SpreadProperty | ObjectMethod
  >,
  needsFlexRemapping: boolean,
): Array<ObjectProperty | SpreadElement> {
  return properties.reduce((properties, node) => {
    if (
      node.type === "ObjectProperty" &&
      node.key.type === "Identifier" &&
      node.value.type === "StringLiteral"
    ) {
      const attr = toRN([[node.key.name, node.value.value]]);

      Object.entries(attr).forEach(([key, value]) => {
        if (typeof value !== "string" && typeof value !== "number") {
          // TODO: Handle nested styles
          return;
        }

        const isSupported = _isSupported(key, `${value}`);
        const isRemovable = _isRemovable(key, `${value}`);

        if (!isSupported) {
          properties.push(
            // @ts-ignore
            j.commentLine(" TODO: RN - Unsupported CSS"),
            j.commentLine(` ${key}: '${value}'`),
          );
          return;
        }

        if (isRemovable) {
          return;
        }

        let identifier = key;

        if (needsFlexRemapping) {
          switch (identifier) {
            case "justifyContent":
              identifier = "alignItems";
              break;
            case "alignItems":
              identifier = "justifyContent";
              break;
          }
        }

        properties.push(
          j.objectProperty(
            j.identifier(identifier),
            typeof value === "string"
              ? j.stringLiteral(value)
              : j.literal(value),
          ),
        );
      });
    } else if (node.type === "SpreadElement") {
      const spreadName =
        node.argument.type === "Identifier"
          ? node.argument.name
          : // is it ever not an identifier?
            "UNKNOWN_IDENTIFIER";

      logManualWork({
        filePath,
        helpfulMessage: `The codemod for handling inline style props found a style attribute with an object spread into it.
We are unable to verify that this spread object contains entirely valid CSS for react native.

The manual effort here is to track down the variable and verify/change all instances to ensure they are react native compatible.

For example, if the \`${spreadName}\` variable is an import, follow the import (and its respective brand overrides), and verify all of the keys are react native compatible.

If the \`${spreadName}\` variable is a prop coming in from the parent, find all usages of this component, and ensure the prop passed in is valid react native styles.`,
        startingLine: node.loc.start.line,
        endingLine: node.loc.end.line,
      });

      properties.push(
        // @ts-ignore
        j.commentLine(
          " TODO: RN - Verify spread does not include invalid props or styles",
        ),
        node,
      );
    } else {
      throw new Error(
        `Unexpected node type in object of style prop ${node.type}`,
      );
    }

    return properties;
  }, [] as (ObjectProperty | SpreadElement)[]);
}
