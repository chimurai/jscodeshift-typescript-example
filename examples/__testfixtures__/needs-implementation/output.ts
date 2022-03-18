import { Box } from '@rbilabs/universal-components';

const MAX_CONTENT_WIDTH_PX_DESKTOP = 12;

export const InterpolatedVariables = Box.withConfig({
  width: `${MAX_CONTENT_WIDTH_PX_DESKTOP}px`,
});

export const ImplicitRowFlex = Box.withConfig({
  flexDirection: 'row',
  justifyContent: 'center',
});

export const NewPropsToDelete = Box.withConfig({});