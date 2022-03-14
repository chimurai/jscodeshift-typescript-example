import { Box as UCLBox } from '@rbilabs/universal-components';

export const Box = UCLBox.withConfig<{
  secondary: boolean
}>(p => ({
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
}));
