import { Box } from '@rbilabs/universal-components';

export const UnauthenticatedContainer = Box.withConfig<{
  center: boolean
}>(p => ({
  paddingX: 0,
  paddingY: '$4',
  flexWrap: 'wrap',
  flexDirection: 'row',
  justifyContent: p.center ? 'center' : 'flex-end',

  alignItems: {
    lg: 'center',
  },
}));
