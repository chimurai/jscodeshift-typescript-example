import { Collection, FileInfo, JSCodeshift } from "jscodeshift";
import { logManualWork, commitManualLogs } from "../logger";
import { registerUCLImportSpecifiers } from "./utils/register-ucl-import-specifiers";
import { removeComponentLibaryImport } from "./utils/remove-component-library-import";

const conversions = [
  {
    from: "div",
    to: "Box",
  },
  {
    from: "span",
    to: "Box",
  },
  {
    insertComments: "This was a <ul> tag. Verify its styled properly",
    from: "ul",
    to: "Box",
  },
  {
    insertComments: "This was a <li> tag. Verify its styled properly",
    from: "li",
    to: "Box",
  },
  {
    from: "hr",
    to: "Divider",
  },
  {
    from: "h1",
    to: "Header",
    attributes: [
      { name: "accessibilityLevel", value: 1 },
      { name: "variant", value: "headerOne" },
    ],
  },
  {
    from: "h2",
    to: "Header",
    attributes: [{ name: "variant", value: "headerTwo" }],
  },
  {
    from: "h3",
    to: "Header",
    attributes: [{ name: "variant", value: "headerThree" }],
  },
  {
    from: "h4",
    to: "Header",
    attributes: [{ name: "variant", value: "headerFour" }],
  },
  {
    from: "h5",
    to: "Header",
    attributes: [{ name: "variant", value: "headerFive" }],
  },
  {
    from: "b",
    to: "Text",
    attributes: [{ name: "fontWeight", value: "bold" }],
  },
  {
    from: "p",
    to: "Text",
  },
  {
    from: "i",
    to: "Text",
    attributes: [{ name: "italic", value: true }],
  },
  {
    // TODO: Any attributes?
    from: "strong",
    to: "Text",
  },
];

export function transformRenameJSXPrimitives(
  root: Collection<any>,
  j: JSCodeshift,
  file: FileInfo,
) {
  conversions.forEach(({ from, to, attributes = [], insertComments }) => {
    root.findJSXElements(from).forEach((node) => {
      // Add all the UCL imports we need
      const nodeName = registerUCLImportSpecifiers(root, j, to);

      if (node.value.openingElement.name.type === "JSXIdentifier") {
        node.value.openingElement.name.name = nodeName;
      }
      if (node.value.closingElement.name.type === "JSXIdentifier") {
        node.value.closingElement.name.name = nodeName;
      }

      // special handling if the attribute has a style prop
      node.value.openingElement.attributes.unshift(
        ...attributes.map((attribute) =>
          j.jsxAttribute.from({
            name: j.jsxIdentifier(attribute.name),

            // this ternary allows jsx attributes like `<Text italic>` to not directly have `italic={true}`
            ...(attribute.value !== true
              ? {
                  value:
                    typeof attribute.value === "string"
                      ? j.stringLiteral(attribute.value)
                      : j.jsxExpressionContainer(j.literal(attribute.value)),
                }
              : {}),
          }),
        ),
      );

      // Insert comments above the JSX Node
      if (insertComments) {
        node.value.comments = node.value.comments || [];
        if (node.parentPath.node.type === "JSXElement") {
          logManualWork({
            filePath: file.path,
            helpfulMessage: `The codemod for renaming JSX primitives (<div> to <Box>) had some uncertainty when converting <${from}> to <${nodeName}>.`,
            startingLine: node.parentPath.node.loc.start.line,
            endingLine: node.parentPath.node.loc.end.line,
          });
          node.insertBefore(
            j.jsxExpressionContainer.from({
              expression: j.jsxEmptyExpression.from({
                comments: [
                  j.commentBlock(`TODO: RN - ${insertComments}`, true, true),
                ],
              }),
            }),
          );
        } else {
          logManualWork({
            filePath: file.path,
            helpfulMessage: `The codemod for renaming JSX primitives (<div> to <Box>) had some uncertainty when converting <${from}> to <${nodeName}>.`,
            startingLine: node.parentPath.node.loc.start.line,
            endingLine: node.parentPath.node.loc.end.line,
          });
          node.value.comments.push(
            j.commentLine(` TODO: RN - ${insertComments}`, false, true),
          );
        }
      }
    });
  });

  // special handling for <br />
  root.findJSXElements("br").forEach((node) => {
    // when BR is rendered in jsx, convert it to {"\n"}
    if (node.parentPath.node.type === "JSXElement") {
      node.replace(j.jsxExpressionContainer(j.stringLiteral("\n")));
    } else {
      node.replace(j.stringLiteral("\n"));
    }
  });

  // Drop any component library imports
  removeComponentLibaryImport(root, j);
}
