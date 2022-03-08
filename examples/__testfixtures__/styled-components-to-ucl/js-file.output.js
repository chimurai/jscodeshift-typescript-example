import { Box } from '@rbilabs/universal-components';

export const Basic = Box.withConfig(p => ({
  _text: {
    textAlign: 'left',
    color: p.color,
  },

  backgroundColor: p.backgroundColor,
}));

