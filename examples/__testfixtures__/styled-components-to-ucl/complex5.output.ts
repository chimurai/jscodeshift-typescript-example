import { Box } from '@rbilabs/universal-components';

export const UnauthenticatedContainer = Box.withConfig<{ center: boolean }>(p => ({
  paddingX: 0,
  paddingY: '$4',
  flexWrap: 'wrap',
  flexDirection: 'row',
  justifyContent: p.center ? 'center' : 'flex-end',

  alignItems: {
    lg: 'center',
  },
}));

export const ItemOfferHeading = Box.withConfig<{ $isApplied: boolean }>(p => ({
  _text: {
    fontSize: 10,
    textTransform: 'uppercase',
    color: p.$isApplied ? Styles.color.black : Styles.color.red,
  },
}))

export const Y = Box.withConfig<{ center: boolean, $isApplied: boolean }>(p => ({
  _text: {
    color: p.$isApplied ? Styles.color.black : Styles.color.red,
  },

  alignItems: p.center ? 'center' : 'flex-end',
}));

export const Z = Box.withConfig<{ center: boolean, $isApplied: boolean }>(p => ({
  alignItems: p.center ? 'center' : 'flex-end',
  alignSelf: p.center ? 'center' : 'flex-end',

  _text: {
    color: p.$isApplied ? Styles.color.black : Styles.color.red,
  },
}));
