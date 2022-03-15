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

export function convertObjectProperties(
  j: JSCodeshift,
  properties: Array<
    Property | ObjectProperty | SpreadElement | SpreadProperty | ObjectMethod
  >,
  needsFlexRemapping: boolean,
): Array<ObjectProperty> {
  return properties.reduce((properties, node) => {
    // TODO: Do we need to handle spread elements?
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
    } else {
      throw new Error(
        `Unexpected node type in object of style prop ${node.type}`,
      );
    }

    return properties;
  }, [] as ObjectProperty[]);
}
