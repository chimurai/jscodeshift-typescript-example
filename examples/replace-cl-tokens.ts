import { API, FileInfo } from 'jscodeshift';

export default function transformer(file: FileInfo, api: API) {
  const j = api.jscodeshift;

  const root = j(file.source);

  return root.find(j.Identifier, { name: 'token' })
    .closest(j.CallExpression)
    // .closest(j.TemplateLiteral)
    .replaceWith(nodePath => {
      // console.log('nodePath:', nodePath);
      // get the underlying Node
      // const paretn = nodePath.node.closest(j.TemplateLiteral)
      const { node } = nodePath;
      // console.log('node:', node);
      // @ts-ignore
      const tokenString = node.arguments[0].value;
      // This will make it a string
      return j.stringLiteral('token.' + tokenString);
      // This will make it an object the css to RN will turn into a string
      // return 'token.' + tokenString;
    }).toSource();;
}
