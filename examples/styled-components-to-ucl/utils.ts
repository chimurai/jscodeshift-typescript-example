import { JSCodeshift } from 'jscodeshift';
import * as _ from 'lodash/fp';

const styleColorMap = {
  'black': 'black',
}

export const mediaPropertyNames = {
  'mobile': { origProp: 'lg', newProp: 'base', },
  'mobileTiny': { origProp: 'lg', newProp: 'base', },
  'mobileSmall': { origProp: 'lg', newProp: 'base', },
  'mobileFullscreen': { origProp: 'lg', newProp: 'base', },
  'mobileLandscape': { origProp: 'lg', newProp: 'base', },
  'desktop': { origProp: 'base', newProp: 'lg', },
  'desktopLarge': { origProp: 'base', newProp: 'lg', },
};

const primitiveMap = {
  '$spacing0': '$0',
  '$spacing1': '$1',
  '$spacing2': '$2',
  '$spacing3': '$3',
  '$spacing4': '$4',
  '$spacing5': '$5',
  '$spacing6': '$6',
  '$spacing7': '$8',
  '$spacing8': '$10',
  '$spacing9': '$12',
  '$spacing10': '$13.5',
  '$spacing11': '$20'
};

const boxToTextProperties = [
  'bold',
  'color',
  'font',
  'font',
  'fontSize',
  'fontWeight',
  'highlight',
  'isTruncated',
  'italic',
  'lineHeight',
  'lineSpacing',
  'noOfLines',
  'strickThrough',
  'sub',
  'textAlign',
  'textTransform',
  'underline',
  'variant',
];

export const isATextProp = (p) => _.includes(p, boxToTextProperties)

const brandFontMap = {
  'hero': 'hero',
  'headerOne': 'headerOne',
  'headerTwo': 'headerTwo',
  'headerThree': 'headerThree',
  'headerFour': 'headerFour',
  'copyOne': 'copyOne',
  'copyTwo': 'copyTwo',
  'formUtility': 'formUtility',
};

const removeProps = [
  /^animation/,
  /^transition/,
];

const unsupportedProps = [
  /^objectFit$/,
  /^transform$/,
  /^span$/,
];

const unsupportedValue = [
  /^calc/,
  /^relative$/,
];

const _isUnsupported = (test, regex) =>
  _.some(re => re.test(test), regex);

const _isRemovable = (property: string, value: string) => {
  if (property === 'position' && value === 'relative') {
    return true;
  }

  if (property === 'flexDirection' && value === 'column') {
    return true;
  }

  if (property === 'display' && value === 'flex') {
    return true;
  }

  return false;
};

export const isSupported = (property: string, value: string) => {


  if (_isRemovable(property, value)) {
    return [true, true];
  }

  if (property === 'display' && !['none'].includes(value)) {
    return [false, false];
  }

  if (_isUnsupported(property, removeProps)) {
    return [false, true];
  }

  // Broken stuff
  // -----------
  if (_isUnsupported(property, unsupportedProps)) {
    return [false, false];
  }
  if (_isUnsupported(value, unsupportedValue)) {
    return [false, false];
  }
  return [true, false];
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

const valueToType = (j: JSCodeshift, value) => {
  switch (typeof value) {
    case 'string':
      return j.tsStringKeyword();
    case 'number':
      return j.tsNumberKeyword();
    case 'boolean':
      return j.tsBooleanKeyword();

    default:
      return j.tsBooleanKeyword();
    // throw new Error('valueToType not found: ' + value)
  }
}


interface IMapping {
  component: string;
  notSupported?: string | boolean;
  moveText?: boolean;
}

const elementMap: Record<string, IMapping> = {
  'div': { component: 'Box', notSupported: true },
  'span': { component: 'Box' },
  'section': { component: 'Box' },
  'h1': { component: 'Header' },
  'h2': { component: 'Header' },
  'h3': { component: 'Header' },
  'h4': { component: 'Header' },
  'h5': { component: 'Header' },
  'h6': { component: 'Header' },
  'p': { component: 'Text' },
  'header': { component: 'Box' },
  'nav': { component: 'Box' },
  'label': { component: 'Text', notSupported: 'use InputLabel' },
  'button': { component: 'Button' },
  'ul': { component: 'Box', notSupported: 'use ScrollView' },
  'li': { component: 'Box', notSupported: 'use ScrollView' },
  'a': { component: 'Box', notSupported: 'use /component/link' },
  'form': { component: 'Box', notSupported: true },
  // 'svg': { component: 'Icon' },
  'fieldset': { component: 'Box', notSupported: true },
  'input': { component: 'Box', notSupported: true },
  'legend': { component: 'Box', notSupported: true },
  'hr': { component: 'Divider' },
};

export const getElementMapping = (el: string) => {
  const found = elementMap[el];

  if (!found) {
    throw new Error('element not found: ' + el);
  }
  return found;
}

export const parseExpression = (j: JSCodeshift, expression) => {
  const finalVars = [];

  if (expression.type === 'MemberExpression') {
    let v = expression;
    // TODO maps styles or maybe more this to a separate code mod
    // remove Styles
    let includeTypes = true;

    // Local variables
    if (expression?.object?.type === 'Identifier') {
      if (expression.object.name === 'primitive') {
        const foundPrimitive = primitiveMap[expression.property.name]
        if (foundPrimitive) {
          v = j.stringLiteral(foundPrimitive);
          includeTypes = false;
        }
      }
      if (expression.object.name === 'brandFont') {
        const foundPrimitive = brandFontMap[expression.property.name]
        if (foundPrimitive) {
          v = j.stringLiteral(foundPrimitive);
          includeTypes = false;
        }
      }
    }

    if (expression?.object?.type === 'MemberExpression') {
      if (
        expression?.object?.object?.name === 'Styles' ||
        expression?.object?.object?.object?.name === 'Styles'
      ) {
        includeTypes = false;
        v = expression;
        // TODO
        // v = stylesToValue(j, expression.object.property.name, expression.property.name);
      }
    }

    const propertyName = expression?.property?.name;
    let vars;
    if (propertyName && includeTypes) {
      vars = [{
        name: propertyName,
        type: valueToType(j, propertyName),
      }];
    }
    return {
      value: v,
      vars,
    }
  }
  if (expression.type === 'ArrowFunctionExpression') {
    // And change `props` to `p`
    if (expression.body?.object?.name === 'props') {
      expression.body.object.name = 'p';
    }
    const { value, vars } = parseExpression(j, expression.body);
    expression.body = value;
    if (vars?.length) finalVars.push(vars);
    return {
      value: expression.body,
      vars,
    }
  }

  if (expression.type === 'ConditionalExpression') {
    const consequent = parseExpression(j, expression.consequent);
    expression.consequent = consequent.value;
    const alternate = parseExpression(j, expression.alternate);
    expression.alternate = alternate.value;
    const conditionalVar = expression?.test?.property?.name
    let localVars = [];
    if (conditionalVar) {
      localVars.push({
        name: conditionalVar,
        type: j.tsBooleanKeyword(),
      })
    }
    return {
      value: expression,
      vars: [
        ...(localVars || []),
        ...(consequent.vars || []),
        ...(alternate.vars || []),
      ]
    }
  }

  if (expression.type === 'CallExpression') {
    // Check for tokens
    if (expression?.callee?.property?.name === 'token') {
      // if one is found then we should return a string instead of an arrow function
      // We also don't care about types in that case
      return {
        value: j.stringLiteral('__legacyToken.' + expression.arguments[0]?.value),
        vars: null,
      }
    } else {
      // on all other call expressions we want the name of the property so that we can
      // add it to the types
      const propertyName = expression?.property?.name;
      return {
        value: expression,
        vars: [{
          name: propertyName,
          type: valueToType(j, propertyName),
        }],
      }
    }
  }
  throw new Error('Expression not implemented type: ' + expression.type)
};
