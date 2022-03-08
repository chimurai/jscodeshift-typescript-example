import { Box, Text } from '@rbilabs/universal-components';
import { primitive } from 'styles/constants/primitives';

export const BannerContainer = Box.withConfig({
  paddingX: '$4',
  paddingY: 0,
  overflow: 'hidden',

  _text: {
    fontFamily: Styles.fontFamily.base,
    color: 'white',
  },

  boxShadow: 'default',
  backgroundColor: primitive.th.$coffeeBrown,
});

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
  // Inline comment
  borderWidth: 1,

  // And another
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
  // Inline comment 
  border: solid 1px ${Styles.color.grey.five};
  // And another
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
