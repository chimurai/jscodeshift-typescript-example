import { Box } from '@rbilabs/universal-components';

export const Component = Box.withConfig({
  paddingX: '$1',
  paddingY: '$3',

  margin: {
    base: '$3',
    lg: '$4',
  },
});

export const Second = Box.withConfig({
  margin: {
    lg: '$3',
    base: '$1',
  },
});
