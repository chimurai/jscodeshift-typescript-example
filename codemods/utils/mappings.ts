import { JSCodeshift } from 'jscodeshift';
import * as _ from 'lodash/fp';
import { clearConfigCache } from 'prettier';

const styledComponentsImportsToRemove = ['keyframes'];
export const styledComponentImportFunctionShouldBeRemove = name =>
  _.contains(name, styledComponentsImportsToRemove);

const styleColorMap = {
  black: 'black',
};

export const mediaPropertyNames = {
  mobile: { origProp: 'lg', newProp: 'base' },
  mobileTiny: { origProp: 'lg', newProp: 'base' },
  mobileSmall: { origProp: 'lg', newProp: 'base' },
  mobileFullscreen: { origProp: 'lg', newProp: 'base' },
  mobileLandscape: { origProp: 'lg', newProp: 'base' },
  desktop: { origProp: 'base', newProp: 'lg' },
  desktopLarge: { origProp: 'base', newProp: 'lg' },
};

export const primitiveMap = {
  $spacing0: '$0',
  $spacing1: '$1',
  $spacing2: '$2',
  $spacing3: '$3',
  $spacing4: '$4',
  $spacing5: '$5',
  $spacing6: '$6',
  $spacing7: '$8',
  $spacing8: '$10',
  $spacing9: '$12',
  $spacing10: '$13.5',
  $spacing11: '$20',
  $black: 'black',
  $white: 'white',
  $error: 'errorRed',
  $disabledText: 'blackOpacity.50',
  $disabledTextReversed: 'whiteOpacity.50',
  $blackOpacity70: 'blackOpacity.70',
  $blackOpacity30: 'blackOpacity.30',
  $blackOpacity10: 'blackOpacity.10',
  $blackOpacity4: 'blackOpacity.5',
  $whiteOpacity30: 'whiteOpacity.30',
  $whiteOpacity10: 'whiteOpacity.10',
  $whiteOpacity4: 'whiteOpacity.5',
};

const boxToTextProperties = [
  'bold',
  'color',
  'font',
  'font',
  'fontSize',
  'fontWeight',
  'fontStyle',
  'fontFamily',
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

export const isATextProp = p => _.includes(p, boxToTextProperties);

export const brandFontMap = {
  hero: 'hero',
  headerOne: 'headerOne',
  headerTwo: 'headerTwo',
  headerThree: 'headerThree',
  headerFour: 'headerFour',
  copyOne: 'copyOne',
  copyTwo: 'copyTwo',
  formUtility: 'formUtility',
};

const styleFontFamilyMap = {
  base: 'heading',
  body: 'body',
  alternative: 'alternative',
  brand: 'heading',
};

// Remove
// ------

// Must match both property and value
const removePropertyValuePairs = [
  { property: /^position/, value: /^relative/ },
  { property: /^flexDirection/, value: /^column/ },
  { property: /^flex-direction/, value: /^column/ },
  { property: /^display/, value: /^flex/ },
];

// Props only
const removeProperties = [
  /^animation/,
  /^transition/,
  /^text-shadow$/,
  /^textShadow$/,
  /^text-shadow-offset$/,
  /^textShadowOffset$/,
  /^fontStretch$/,
  /^font-stretch$/,
];

// Unsupported
// -----------
const unsupportedPropertyValuePairs = [
  // anything but flex or none is not supported
  { property: /^display/, value: /^(?!.*(none|flex)).*/ },
];

const unsupportedProperties = [
  /^boxShadow$/,
  /^box-shadow$/,
  /^objectFit$/,
  /^object-fit$/,
  /^transform/,
  /^content$/,
  /^shadow-offset$/,
  /^shadowOffset$/,
  /^span$/,
  /^list-style$/,
  /^listStyle$/,
  /^overflow-x$/,
  /^overflowX$/,
  /^overflowY$/,
  /^grid/,
];

const unsupportedValue = [
  /^calc/,
  /^max/,
  /^min/,
  /^relative$/,
];

const _isInReg = (test, regex) => _.some(re => re.test(test), regex);

export const _isRemovable = (property: string, value: string) => {

  // Remove by property and value matches
  const found = _.some(({ property: _p, value: _v }) =>
    _p.test(property) && _v.test(value))(removePropertyValuePairs);

  if (found) {
    return true;
  }

  // Remove by property
  if (_isInReg(property, removeProperties)) {
    return true;
  }
  // Remove by value
  if (_isInReg(property, removeProperties)) {
    return true;
  }

  return false;
};

export const _isSupported = (property: string, value: string) => {
  // Unsupported by property and value matches
  const found = _.some(({ property: _p, value: _v }) =>
    _p.test(property) && _v.test(value))(unsupportedPropertyValuePairs);

  if (found) {
    return false;
  }
  // Unsupported by property
  if (_isInReg(property, unsupportedProperties)) {
    return false;
  }
  // Unsupported by value
  if (_isInReg(value, unsupportedValue)) {
    return false;
  }
  return true;
};

// Css Processing order
// -------------------

// 1. Select a mapping based on the element or import e.g. `div` -> `Box`
// 2. PostCSS - turns the CSS string into CSS Object
// 3. Pre css-to-react-native
//   a. Check for mapping based on the object properties search for a better mapping.
//   b. if new mapping  add/remove properties.
//   c. if mapping changed re-run the pre process
// 4. css-to-react-native property conversion
// 5. Cleanup - convert (NB props) e.g. fontFamily: ‘$4’
// 6. Convert to AST
// 7. Convert expressions
//   a. steps 3-6..
export const checkForBetterMappingBasedOnProperties = (currentMapping: IElementMapping, obj: object): {
  newObject: object,
  newMapping: IElementMapping,
  hasBetterMapping: boolean,
} => {
  let newObject = null;
  let hasBetterMapping = false;
  let newMapping = currentMapping;

  // Based on properties
  _.flow(
    _.entries,
    // _.forEach((key, value) => {
    //   console.log(`key, value: `, key, value);
    // }),
  )(obj)

  return { newObject, newMapping, hasBetterMapping };
};

const convertLineHeight = (currentValue: string, obj: object) => {
  return currentValue;
}

const identifierMapping = {
  'lineHeight': (currentValue: string, obj: object) => {
    return {
      newValue: currentValue,
      isSkipable: true,
    }
  },
  'textDecoration': (currentValue: string, obj: object) => {
    return {
      newValue: currentValue,
      isSkipable: true,
    }
  },
}

// One-offs Pre toRN
// -------
export const preToRNTransform = (identifier, value, obj) => {
  let i = identifier;
  let v = value;
  let isSupported = _isSupported(identifier, value);
  let isRemovable = _isRemovable(identifier, value);
  let isSkipable = false;

  // Mappings
  // --------
  const found = identifierMapping[value];
  if (found) {
    const {
      newValue,
      isSkipable: _isSkipable,
    } = found(v, obj);
    v = newValue;
    isSkipable = _isSkipable;
  }

  // if (identifier === 'boxShadow') {
  //   i = 'boxShadow';
  //   v = 'default';
  //   isSkipable = true;
  //   isSupported = true;
  // }
  if (identifier === 'margin' && _.includes('auto', value)) {
    i = 'align-self';
    v = 'center';
  }
  if (identifier === 'textDecoration') {
    i = 'underline';
    v = value === 'none' ? false : true;
    isSkipable = true;
  }

  // Skip font because we are converting to a variant
  if (identifier === 'font') {
    isSkipable = true;
  }

  // Supported
  // ---------

  // Objects are not supported
  if (_.isObject(value)) {
    isSupported = false;
  }

  if (identifier === 'position' && value === 'fixed') {
    isSupported = false;
  }

  return {
    identifier: i,
    value: v,
    isSupported,
    isRemovable,
    isSkipable,
  };
};

// One-offs Post toRN
// -------
export const postToRNTransform = (identifier, value, needsFlexRemapping) => {
  let i = identifier;
  let v = value;
  let isSupported = _isSupported(identifier, value);
  let isRemovable = _isRemovable(identifier, value);

  if (identifier === 'font') {
    // The correct variant is set in utils/parseExpression
    i = 'variant';
  }

  // Objects are not supported
  if (_.isObject(value)) {
    isSupported = false;
  }

  if (needsFlexRemapping) {
    switch (identifier) {
      case 'justifyContent':
        i = 'alignItems';
        break;
      case 'alignItems':
        i = 'justifyContent';
        break;
    }
  }

  return {
    identifier: i,
    value: v,
    isSupported,
    isRemovable,
  };
};

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

export const valueToType = (j: JSCodeshift, value) => {
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
};

export interface IElementMapping {
  from: string;
  to: string;
  insertComments?: string | boolean;
  attributes?: {
    name: string;
    value?: number | string | boolean;
    comment?: string;
  }[];
  customImport?: {
    path: string;
    isDefault?: boolean;
    specifier?: string;
  };
  customPreProcessing?: (obj: object) => object;
  customPostProcessing?: (obj: object) => object;
}

const ActionButtonImport = {
  path: 'components/action-button',
  isDefault: true,
  specifier: 'ActionButton',
};

const LinkImport = {
  path: 'components/link',
  isDefault: true,
  specifier: 'Link',
};

const BoxPostProcessing = obj => {
  // const res = _.pickBy((_value, key) => {
  //   const shouldKeep = _isInReg(key, [/^width/, /^padding/, /^margin/]);
  //   return shouldKeep;
  // })(obj);
  let hasText = false;
  Object.keys(obj).map(k => {
    if (!isATextProp(k)) {
      return;
    }
    const v = obj[k];
    hasText = true;
    // Mvoe
    obj._text = obj._text = {};
    obj._text[k] = v;
    // remove the property
    delete obj[k];
  })
  return obj;
};

export const elementArray: Array<IElementMapping> = [
  {
    from: 'div',
    to: 'Box',
    // customPreProcessing: BoxPostProcessing,
    customPostProcessing: BoxPostProcessing,
  },
  {
    from: 'span',
    to: 'Box',
  },
  {
    insertComments: 'This was a <ul> tag. Verify its styled properly',
    from: 'ul',
    to: 'Box',
  },
  {
    insertComments: 'This was a <li> tag. Verify its styled properly',
    from: 'li',
    to: 'Box',
  },
  {
    from: 'hr',
    to: 'Divider',
    // remove most properties and set the default thickness
    customPostProcessing: obj => {
      const res = _.pickBy((_value, key) => {
        const shouldKeep = _isInReg(key, [/^width/, /^padding/, /^margin/]);
        return shouldKeep;
      })(obj);

      // @ts-ignore
      res.thickness = '1';
      return res;
    },
  },
  {
    from: 'h1',
    to: 'Header',
    attributes: [
      { name: 'accessibilityLevel', value: 1 },
      { name: 'variant', value: 'headerOne' },
    ],
  },
  {
    from: 'h2',
    to: 'Header',
    attributes: [{ name: 'variant', value: 'headerTwo' }],
  },
  {
    from: 'h3',
    to: 'Header',
    attributes: [{ name: 'variant', value: 'headerThree' }],
  },
  {
    from: 'h4',
    to: 'Header',
    attributes: [{ name: 'variant', value: 'headerFour' }],
  },
  {
    from: 'h5',
    to: 'Header',
    attributes: [{ name: 'variant', value: 'headerFive' }],
  },
  {
    from: 'h6',
    to: 'Header',
    attributes: [{ name: 'variant', value: 'headerFive' }],
  },
  {
    from: 'b',
    to: 'Text',
    attributes: [{ name: 'fontWeight', value: 'bold' }],
  },
  {
    from: 'p',
    to: 'Text',
  },
  {
    from: 'i',
    to: 'Text',
    attributes: [{ name: 'italic', value: true }],
  },
  {
    // TODO: Any attributes?
    from: 'strong',
    to: 'Text',
  },
  {
    from: 'section',
    to: 'Box',
    attributes: [
      {
        name: 'accessibilityRole',
        value: 'section',
        comment: '@ts-ignore web only attribute',
      },
    ],
  },
  {
    from: 'header',
    to: 'Box',
    attributes: [{ name: 'accessibilityRole', value: 'header' }],
  },
  {
    from: 'nav',
    to: 'Box',
    attributes: [
      {
        name: 'accessibilityRole',
        value: 'header',
        comment: '@ts-ignore web only attribute',
      },
    ],
    insertComments: 'This was a <nav> tag. Verify its styled properly',
  },
  {
    from: 'button',
    to: 'Button',
    // customImport: ActionButtonImport,
    // TODO post processing
    // customPostProcessing: (obj) => obj,
  },
  {
    from: 'a',
    to: 'Link',
    customImport: LinkImport,
    // TODO change:
    // - `href` to `to`
    // - nest text
    // customPostProcessing: (obj) => obj,
  },
  {
    from: 'fieldset',
    to: 'FormControl',
    insertComments: 'This was a <input> tag. Verify its styled properly',
  },
  {
    from: 'input',
    to: 'Input',
    insertComments: 'This was a <input> tag. Verify its styled properly',
  },
  {
    from: 'label',
    to: 'Text',
    insertComments: 'This was a <label> tag. This should be converted to a UL <FormControl.Label>',
  },
  {
    from: 'legend',
    to: 'Box',
    insertComments: 'This was a <legend> tag. Verify its styled properly',
  },
  {
    from: 'svg',
    to: 'Svg',
    insertComments: 'This was a <svg> tag. Verify its styled properly',
  },
];

export const getElementMapping = (el: string, attr = 'from') => {
  const found = elementArray.find(e => e[attr] === el);

  if (!found) {
    throw new Error("element not found: " + el);
  }
  return found;
};

