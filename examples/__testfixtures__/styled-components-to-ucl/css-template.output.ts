import { Text, Box } from '@rbilabs/universal-components';

export const TierLabel = Text.withConfig({
  alignItems: 'center',
  justifyContent: 'center',
  top: 0,
  left: 0,
  variant: 'headerTwo',
  margin: 0,
  lineHeight: 1,
  color: '__legacyToken.text-button-secondary',
  zIndex: Styles.zIndex.below,
  height: '$8',
  fontSize: 16,
});

export const ShortCodeErrorContainer = Box.withConfig({
  borderWidth: 1,
  borderColor: Styles.color.grey.five,
  borderStyle: 'solid',
  paddingX: '30px',
  paddingY: '$4',

  _text: {
    textAlign: 'center',
  },

  borderTopLeftRadius: Styles.borderRadius,
  borderTopRightRadius: Styles.borderRadius,
  borderBottomRightRadius: Styles.borderRadius,
  borderBottomLeftRadius: Styles.borderRadius,
  backgroundColor: Styles.color.black,
  width: 'auto',
  minWidth: 250,
  minHeight: 98,
})/*
TODO RN: unsupported CSS
Some attributes were not converted.

export const ShortCodeErrorContainer = styled.div`
  border: solid 1px ${Styles.color.grey.five};
  padding: 1rem 1.875rem;
  text-align: center;
  border-radius: ${Styles.borderRadius};
  background-color: ${Styles.color.black};
  width: auto;
  min-width: 15.625rem;
  min-height: 6.125rem;

  & > button {
    display: flex;
    font-size: 0.875rem;
    margin: 1rem auto 0;
    padding: 0.7rem 2rem;
    background-color: ${primitive.$white};
    color: ${Styles.color.black};

    svg {
      transform: rotate(50deg);
      width: 0.875rem;
      margin-right: 0.25rem;
    }
  }
`;

*/;

const LinkStyles = {
  color: Styles.color.black,

  // TODO RN: unsupported CSS
  // display: 'block',

  variant: Styles.fontFamily.base,
  fontWeight: Styles.fontWeight.heavy,
  underline: false,

  borderBottomWidth: {
    base: 1,
    lg: 0,
  },

  borderBottomColor: {
    base: Styles.color.grey.nine,
    lg: 'black',
  },

  borderBottomStyle: {
    base: 'solid',
    lg: 'solid',
  },

  fontSize: {
    base: 16,
    lg: 26,
  },

  paddingX: {
    base: 0,
    lg: 0,
  },

  paddingY: {
    base: '18px',
    lg: '$8',
  },
}/*
TODO RN: unsupported CSS
Some attributes were not converted.

const LinkStyles = css`
  border-bottom: solid 1px ${Styles.color.grey.nine};
  color: ${Styles.color.black};
  display: block;
  font-family: ${Styles.fontFamily.base};
  font-size: 1rem;
  font-weight: ${Styles.fontWeight.heavy};
  padding: 1.125rem 0;
  text-decoration: none;

  :last-of-type {
    border-bottom: 0;
  }

  ${Styles.desktop`
    border-bottom: 0;
    font-size: 1.625rem;
    padding: 2rem 0
  `};
`;

*/;

export const StyledLink = Link.withConfig({
  ...LinkStyles,
})
