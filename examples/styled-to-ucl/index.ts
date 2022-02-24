import * as _ from 'lodash/fp';
import * as postcss from "postcss";
import * as postcssJs from "postcss-js";
import toRN from "css-to-react-native";

const tagTypes = {
  Identifier: node => node,
  CallExpression: node => node.callee,
  MemberExpression: node => node.object,
};

const importSpecifiers = ['ImportDefaultSpecifier', 'ImportSpecifier'];

import { API, FileInfo } from 'jscodeshift';

export default function transformer(file: FileInfo, api: API) {
  const j = api.jscodeshift;
  const ast = j(file.source);

  const templateElement = _.curry((tail, raw) => (
    j.templateElement({ cooked: JSON.stringify(raw).slice(1, -1), raw }, tail)
  ));

  ast.find(j.TaggedTemplateExpression).forEach((path) => {
    const { quasi, tag } = path.node;
    if (!(tag.type in tagTypes)) return;

    // Get the identifier for styled in either styled.View`...` or styled(View)`...`
    // Note we aren't checking the name of the callee
    const callee = tagTypes[tag.type](tag);
    if (callee.type !== 'Identifier') return;

    // Find the import statement for the `styled` part
    const importSpecifier = _.get([callee.name, 0, 'parentPath'], path.scope.getBindings());
    if (!_.includes(_.get(['value', 'type'], importSpecifier), importSpecifiers)) return;
    const importDeclaration = importSpecifier.parentPath;
    const source = importDeclaration.node.source.value;
    // And make sure it's only for styled-components/native
    if (source !== 'styled-components' && source !== 'styled-components/native') return;

    const { quasis, expressions } = quasi;
    // Substitute all ${interpolations} with arbitrary test that we can find later
    // This is so we can shove it in postCSS
    const substitutionNames = expressions.map((value, index) => `/*__${index}substitution__*/`);
    let cssText =
      quasis[0].value.cooked +
      substitutionNames.map((name, index) => name + quasis[index + 1].value.cooked).join('');
    let substitutionMap = _.fromPairs(_.zip(substitutionNames, expressions));

    // Replace mixin interpolations as comments, but as ids if in properties
    let root = postcss.parse(cssText);
    const notInPropertiesIndexes = {};
    root.walkComments((comment) => {
      const index = substitutionNames.indexOf(`/*${comment.text}*/`);
      if (index >= 0) notInPropertiesIndexes[index] = true;
    });

    substitutionNames.forEach((name, index) => {
      if (!notInPropertiesIndexes[index]) substitutionNames[index] = name.replace(/^\/\*(.+)\*\/$/, '$1');
    });
    cssText =
      quasis[0].value.cooked +
      substitutionNames.map((name, index) => name + quasis[index + 1].value.cooked).join('');
    substitutionMap = _.fromPairs(_.zip(substitutionNames, expressions));

    root = postcss.parse(cssText);
    // root.walkDecls((decl) => {
    //   // const testProp = decl.prop.replace(/-/g, '').toLowerCase();
    //   const obj = toRN([[decl.prop, decl.value]]);
    //   // @ts-ignore
    //   // decl.prop = _.keys(obj)[0];
    //   const prop = _.keys(obj)[0];
    //   decl.value = obj[prop] as string;
    // });

    const obj = postcssJs.objectify(root);
    // console.log('obj: ', obj);
    const properties = _.map((key: string) => {
      const initialValue = obj[key];
      const convertedObj = toRN([[key, initialValue]]);
      const property = _.keys(convertedObj)[0];
      const foundExpression = substitutionMap[initialValue];
      const value = foundExpression || j.literal(convertedObj[property] as string);
      return j.property(
        'init',
        j.identifier(key as string),
        value,
      );
    })(_.keys(obj));

    const asObject = j.objectExpression(properties);

    const exprs = j.callExpression(
      j.memberExpression(
        j.identifier('Box'),
        j.identifier('withConfig'),
      ), [asObject]);
    j(path).replaceWith(exprs);
  });

  return ast.toSource();
};

// module.exports.parser = 'tsx';
