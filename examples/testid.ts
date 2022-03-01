import { API, FileInfo } from "jscodeshift";

export default function transformer(file: FileInfo, api: API) {
  const j = api.jscodeshift;

  const root = j(file.source);

  // converts jsx attribute data-testid="foo" to testID="foo"
  root
    .find(
      j.JSXIdentifier,
      (node) => node.type === "JSXIdentifier" && node.name === "data-testid"
    )
    .forEach((path) => {
      path.replace(j.jsxIdentifier("testID"));
    });

  // converts props['data-testid'] to props.testID
  root
    .find(
      j.MemberExpression,
      (node) =>
        node.property.type === "StringLiteral" &&
        node.property.value === "data-testid"
    )
    .forEach((path) => {
      path.replace(
        j.memberExpression(path.node.object, j.identifier("testID"))
      );
    });

  // converts functions that descturture 'data-testid' to functions that descturture 'testID'
  root
    .find(
      j.ObjectProperty,
      (node) =>
        node.key.type === "StringLiteral" && node.key.value === "data-testid"
    )
    .forEach((path) => {
      path.replace(
        j.objectProperty.from({
          ...path.node,
          key: j.identifier("testID"),
          shorthand: true,
        })
      );
    });

  // converts typedefs oor 'data-testid' to typedefs for 'testID'
  // console.log(root.getAST()[0].value.program.body.);
  root
    .find(
      j.TSPropertySignature
      // node.key.type === "StringLiteral" && node.key.value === "data-testid"
    )
    .forEach((path) => {
      path.replace(
        j.tsPropertySignature.from({
          ...path.node,
          key: j.identifier("testID"),
        })
      );
    });

  return root.toSource();
}
