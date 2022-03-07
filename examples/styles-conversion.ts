import { API, FileInfo } from 'jscodeshift';

export default function transformer(file: FileInfo, api: API) {
  const j = api.jscodeshift;


  return j(file.source).find(j.MemberExpression, {
    object: {
      name: 'Styles'
    },
    property: {
      name: 'color'
    }
  }).replaceWith(
    nodePath => {
      // get the underlying Node
      // const { node } = nodePath;
      // console.log(node);
      // node.property.name = '';
      // node.object.name = "";
      // replaceWith should return a Node, not a NodePath
      // return node;
      return 'example';
    }
  )
    .toSource();
}
