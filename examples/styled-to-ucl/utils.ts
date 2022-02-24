import { Expression, JSCodeshift } from 'jscodeshift';

const expressionTypes = {
  MemberExpression: (j: JSCodeshift, expression) => {
    // remove Styles
    return {
      value: expression,
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

export const parseExpression = (j: JSCodeshift, expression: Expression) => {
  const fn = expressionTypes[expression.type];
  if (!fn) {
    throw new Error(`type ${expression.type} not found`);
  }
  return fn(j, expression);
}
