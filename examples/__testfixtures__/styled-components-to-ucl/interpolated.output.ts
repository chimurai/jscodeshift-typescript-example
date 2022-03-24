import { Box } from '@rbilabs/universal-components';

const WIDTH_PX = 12;
const HEIGHT_PX = 12;

export const InterpolatedVariables = Box.withConfig({
  width: `${WIDTH_PX}px`,
  height: `pre${HEIGHT_PX}rem`,
  paddingX: '$4',
  paddingY: '$40',
});

export const ImplicitRowFlex = Box.withConfig({
  flexDirection: 'row',
  justifyContent: 'center',
});

export const NewPropsToDelete = Box.withConfig({});
