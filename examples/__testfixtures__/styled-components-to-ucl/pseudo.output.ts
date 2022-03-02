import { Box } from '@rbilabs/universal-components';

export const Component = Box.withConfig({
  padding: '$3',
  backgroundColor: '__legacyToken.background-button-primary-default',

  _hover: {
    padding: '$6',
    backgroundColor: '__legacyToken.background-button-primary-hover',
  },
});
