import { Expression, JSCodeshift } from 'jscodeshift';

const expressionTypes = {
  MemberExpression: (j: JSCodeshift, expression) => {
    // remove Styles
    let v = expression;
    if (expression.object?.object?.name === 'Styles') {
      v = stylesToValue(j, expression.object.property.name, expression.property.name);
    }
    return {
      value: v,
      tag: '',
      vars: null,
    }
  },
  ArrowFunctionExpression: (j: JSCodeshift, expression) => {
    // We need to remove arrow functions


    // Add vars and type

    // And change `props` to `p`
    if (expression.body?.object?.name === 'props') {
      expression.body.object.name = 'p';
    }
    return {
      value: expression.body,
      tag: '',
      vars: [
        {
          name: 'backgroundColor',
          type: j.tsStringKeyword(),
        }, {
          name: 'color',
          type: j.tsStringKeyword(),
        },
      ],
    }
  },
};

const styleColorMap = {
  'black': 'black',
}

const stylesToValue = (j: JSCodeshift, group, value) => {

  console.log(`group: `, group);
  console.log(`value: `, value);
  switch (group) {
    case 'color':
      return j.stringLiteral(styleColorMap[value]);

    default:
      break;
  }
  return;
};

export const parseExpression = (j: JSCodeshift, expression: Expression) => {
  const fn = expressionTypes[expression.type];
  if (!fn) {
    throw new Error(`type ${expression.type} not found`);
  }
  return fn(j, expression);
}
