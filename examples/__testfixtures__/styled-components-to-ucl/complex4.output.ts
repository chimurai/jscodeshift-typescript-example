import { Box, Button, makeUclComponent, Text as UCLText } from '@rbilabs/universal-components';

import { ModalContent } from '../styled';
import { ModalHeading } from 'components/modal';
import { Text } from './somthing';
import theme from './theme';

export const AnotherOne = Box.withConfig<{ secondary: boolean }>(p => ({
  width: '$10',
  height: '$16',
  top: p.secondary ? '5vh' : '10vh',
  flexGrow: 1,
  flexShrink: 1,
  flexBasis: 0,
  paddingTop: '$3',
  paddingRight: '$1',
  paddingBottom: '$3',
  paddingLeft: '1px',

  _text: {
    color: Styles.color.grey.four,
  },

  marginX: 0,
  marginY: '$2',
  backgroundColor: theme.backgroundColor,
}));

export const Container = makeUclComponent(ModalContent).withConfig({
  height: '100%',
  alignItems: 'center',
});

export const StyledModalHeader = makeUclComponent(ModalHeading).withConfig({
  alignSelf: 'center',
  lineHeight: '3xl',
  paddingBottom: 0,
  borderBottomWidth: 0,
  borderBottomColor: 'black',
  borderBottomStyle: 'solid',

  paddingTop: {
    lg: 0,
  },
})/*
TODO: RN - unsupported CSS
Some attributes were not converted.

export const StyledModalHeader = styled(ModalHeading)`
  margin: 0 auto 1rem;
  font-size: 2rem;
  line-height: 2.5rem;
  font-size: 0.9375rem;
  padding-bottom: 0px;
  border-bottom: 0px;
  ${Styles.desktop`
    padding-top: 0;
  `}
`;

*/;

export const LoadingText = UCLText.withConfig({
  textAlign: 'center',
  fontSize: 15,
  lineHeight: 'md',
  fontFamily: Styles.fontFamily.body,
  paddingX: '$10',
  paddingY: '7px',
});

export const LoadingGraphicWrapper = Box.withConfig({
  flexDirection: 'row',
  height: '240px',
  width: '240px',
  borderTopLeftRadius: '50%',
  borderTopRightRadius: '50%',
  borderBottomRightRadius: '50%',
  borderBottomLeftRadius: '50%',
  alignSelf: 'center',
  marginTop: '$4',
  backgroundColor: IMAGE_BACKGROUND_COLOR,
  overflow: 'hidden',
  alignItems: 'center',
  justifyContent: 'center',
});

export const GraphicTextWrapper = Box.withConfig({
  // TODO: RN - unsupported CSS
  // display: 'grid',

  // TODO: RN - unsupported CSS
  // gridTemplateRows: 'auto 1fr',
});


export const TertiaryButton = Button.withConfig({
  backgroundColor: 'none',
  borderWidth: 1,
  borderColor: Styles.color.grey.four,
  borderStyle: 'solid',
  borderTopLeftRadius: Styles.borderRadius,
  borderTopRightRadius: Styles.borderRadius,
  borderBottomRightRadius: Styles.borderRadius,
  borderBottomLeftRadius: Styles.borderRadius,

  _text: {
    color: Styles.color.black,
    fontFamily: Styles.fontFamily.body,
    fontSize: 15,
  },

  paddingX: '$4',
  paddingY: '9px',
  width: '100%',

  _hover: {
    borderTopColor: Styles.color.grey.three,
    borderRightColor: Styles.color.grey.three,
    borderBottomColor: Styles.color.grey.three,
    borderLeftColor: Styles.color.grey.three,
  },
});

export const focusStyle = {
  // https://ghinda.net/article/mimic-native-focus-css/
  // TODO: RN - unsupported CSS
  // outline: '2px solid Highlight',
}/*
TODO: RN - unsupported CSS
Some attributes were not converted.


  // https://ghinda.net/article/mimic-native-focus-css/
  outline: 2px solid Highlight;
  @media (-webkit-min-device-pixel-ratio: 0) {
    outline: -webkit-focus-ring-color auto 5px;
  }

*/
