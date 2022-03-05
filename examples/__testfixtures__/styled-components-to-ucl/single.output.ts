import { Box as UCLBox, Text } from '@rbilabs/universal-components';

export const Box = UCLBox.withConfig({
  width: '$10',
  height: '$16',
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

  marginX: '0',
  marginY: '$2',
});

export const TierLabel = Text.withConfig({
  alignItems: 'center',
  justifyContent: 'center',
  top: '0',
  left: '0',
  variant: 'headerTwo',
  margin: '0',
  lineHeight: '1px',
  color: '__legacyToken.text-button-secondary',
  zIndex: Styles.zIndex.below,
  height: '$8',
  fontSize: '$4',
});
