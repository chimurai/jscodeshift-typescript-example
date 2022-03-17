import { JSCodeshift } from "jscodeshift";
import * as _ from "lodash/fp";

const styledComponentsImportsToRemove = ["keyframes"];
export const styledComponentImportFunctionShouldBeRemove = (name) =>
  _.contains(name, styledComponentsImportsToRemove);

const styleColorMap = {
  black: "black",
};

export const mediaPropertyNames = {
  mobile: { origProp: "lg", newProp: "base" },
  mobileTiny: { origProp: "lg", newProp: "base" },
  mobileSmall: { origProp: "lg", newProp: "base" },
  mobileFullscreen: { origProp: "lg", newProp: "base" },
  mobileLandscape: { origProp: "lg", newProp: "base" },
  desktop: { origProp: "base", newProp: "lg" },
  desktopLarge: { origProp: "base", newProp: "lg" },
};

export const primitiveMap = {
  $spacing0: "$0",
  $spacing1: "$1",
  $spacing2: "$2",
  $spacing3: "$3",
  $spacing4: "$4",
  $spacing5: "$5",
  $spacing6: "$6",
  $spacing7: "$8",
  $spacing8: "$10",
  $spacing9: "$12",
  $spacing10: "$13.5",
  $spacing11: "$20",
  $black: "black",
  $white: "white",
  $error: "errorRed",
  $disabledText: "blackOpacity.50",
  $disabledTextReversed: "whiteOpacity.50",
  $blackOpacity70: "blackOpacity.70",
  $blackOpacity30: "blackOpacity.30",
  $blackOpacity10: "blackOpacity.10",
  $blackOpacity4: "blackOpacity.5",
  $whiteOpacity30: "whiteOpacity.30",
  $whiteOpacity10: "whiteOpacity.10",
  $whiteOpacity4: "whiteOpacity.5",
};

const boxToTextProperties = [
  "bold",
  "color",
  "font",
  "font",
  "fontSize",
  "fontWeight",
  "fontStyle",
  "fontFamily",
  "highlight",
  "isTruncated",
  "italic",
  "lineHeight",
  "lineSpacing",
  "noOfLines",
  "strickThrough",
  "sub",
  "textAlign",
  "textTransform",
  "underline",
  "variant",
];

export const isATextProp = (p) => _.includes(p, boxToTextProperties);

export const brandFontMap = {
  hero: "hero",
  headerOne: "headerOne",
  headerTwo: "headerTwo",
  headerThree: "headerThree",
  headerFour: "headerFour",
  copyOne: "copyOne",
  copyTwo: "copyTwo",
  formUtility: "formUtility",
};

const styleFontFamilyMap = {
  base: "heading",
  body: "body",
  alternative: "alternative",
  brand: "heading",
};

const removeProps = [
  /^animation/,
  /^transition/,
  /^text-shadow$/,
  /^textShadow$/,
  /^text-shadow-offset$/,
  /^textShadowOffset$/,
  /^fontStretch$/,
  /^font-stretch$/,
];

const removeKeyValuePairs = [
  { key: "position", value: "relative" },
  { key: "flexDirection", value: "column" },
  { key: "flex-direction", value: "column" },
  { key: "display", value: "flex" },
];

const unsupportedKeyValuePairs = [
  { key: "position", value: "relative" },
  { key: "flexDirection", value: "column" },
  { key: "flex-direction", value: "column" },
  { key: "display", value: "flex" },
];

const unsupportedIdentifiers = [
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

const unsupportedValue = [/^calc/, /^max/, /^min/, /^relative$/];

const _isInReg = (test, regex) => _.some((re) => re.test(test), regex);

export const _isRemovable = (property: string, value: string) => {
  if (property === "position" && value === "relative") {
    return true;
  }

  if (property === "flexDirection" && value === "column") {
    return true;
  }

  if (property === "display" && value === "flex") {
    return true;
  }

  if (_isInReg(property, removeProps)) {
    return true;
  }

  return false;
};

export const _isSupported = (identifier: string, value: string) => {
  // anything but flex or none is not supported
  if (identifier === "display" && !["none", "flex"].includes(value)) {
    return false;
  }
  if (_isInReg(identifier, unsupportedIdentifiers)) {
    return false;
  }
  if (_isInReg(value, unsupportedValue)) {
    return false;
  }
  return true;
};

// One-offs Pre toRN
// -------
export const preToRNTransform = (identifier, value) => {
  let i = identifier;
  let v = value;
  let isSupported = _isSupported(identifier, value);
  let isRemovable = _isRemovable(identifier, value);
  let isSkipable = false;

  // Mappings
  // --------

  // if (identifier === 'boxShadow') {
  //   i = 'boxShadow';
  //   v = 'default';
  //   isSkipable = true;
  //   isSupported = true;
  // }
  if (identifier === "margin" && _.includes("auto", value)) {
    i = "align-self";
    v = "center";
  }
  if (identifier === "textDecoration") {
    i = "underline";
    v = value === "none" ? false : true;
    isSkipable = true;
  }

  // Skip font because we are converting to a variant
  if (identifier === "font") {
    isSkipable = true;
  }

  // Supported
  // ---------

  // Objects are not supported
  if (_.isObject(value)) {
    isSupported = false;
  }

  if (identifier === "position" && value === "fixed") {
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

  if (identifier === "font") {
    // The correct variant is set in utils/parseExpression
    i = "variant";
  }

  // Objects are not supported
  if (_.isObject(value)) {
    isSupported = false;
  }

  if (needsFlexRemapping) {
    switch (identifier) {
      case "justifyContent":
        i = "alignItems";
        break;
      case "alignItems":
        i = "justifyContent";
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
    case "color":
      return j.stringLiteral(styleColorMap[value]);

    default:
      break;
  }
  return;
};

export const valueToType = (j: JSCodeshift, value) => {
  switch (typeof value) {
    case "string":
      return j.tsStringKeyword();
    case "number":
      return j.tsNumberKeyword();
    case "boolean":
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
    name: string,
    value?: number | string | boolean,
    comment?: string,
  }[]
  customImport?: {
    path: string;
    isDefault?: boolean;
    specifier?: string;
  };
  customPostProcessing?: (obj: object) => object;
}

const ActionButtonImport = {
  path: 'components/action-button',
  isDefault: true,
  specifier: 'ActionButton'
}

const LinkImport = {
  path: 'components/link',
  isDefault: true,
  specifier: 'Link'
}

export const elementArray: Array<IElementMapping> = [
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
    // remove most properties and set the default thickness
    customPostProcessing: (obj) => {
      const res = _.pickBy((_value, key) => {
        const shouldKeep = _isInReg(key, [
          /^width/,
          /^padding/,
          /^margin/,
        ]);
        return shouldKeep;
      })(obj);

      // @ts-ignore
      res.thickness = '1';
      return res;
    }
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
    from: "h6",
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
  {
    from: "section",
    to: "Box",
    attributes: [{ name: "accessibilityRole", value: 'section', comment: '@ts-ignore web only attribute' }],
  },
  {
    from: "header",
    to: "Box",
    attributes: [{ name: "accessibilityRole", value: 'header' }],
  },
  {
    from: "nav",
    to: "Box",
    attributes: [{ name: "accessibilityRole", value: 'header', comment: '@ts-ignore web only attribute' }],
    insertComments: "This was a <nav> tag. Verify its styled properly",
  },
  {
    from: "button",
    to: "Button",
    // customImport: ActionButtonImport,
    // TODO post processing
    // customPostProcessing: (obj) => obj,
  },
  {
    from: "a",
    to: "Link",
    customImport: LinkImport,
    // TODO change:
    // - `href` to `to`
    // - nest text
    // customPostProcessing: (obj) => obj,
  },
  {
    from: "fieldset",
    to: "FormControl",
    insertComments: "This was a <input> tag. Verify its styled properly",
  },
  {
    from: "input",
    to: "Input",
    insertComments: "This was a <input> tag. Verify its styled properly",
  },
  {
    from: "label",
    to: "Text",
    insertComments: "This was a <label> tag. This should be converted to a UL <FormControl.Label>",
  },
  {
    from: "legend",
    to: "Box",
    insertComments: "This was a <legend> tag. Verify its styled properly",
  },
  {
    from: "svg",
    to: "Svg",
    insertComments: "This was a <svg> tag. Verify its styled properly",
  },
];

export const getElementMapping = (el: string) => {
  const found = elementArray.find(e => e.from === el);

  if (!found) {
    throw new Error("element not found: " + el);
  }
  return found;
};
