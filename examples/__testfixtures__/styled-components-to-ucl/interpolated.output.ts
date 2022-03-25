import { Box } from '@rbilabs/universal-components';

const WIDTH_PX = 12;
const HEIGHT_REM = 2;
const PADDING_LEFT_PX = 4;

export const InterpolatedVariables = Box.withConfig({
  width: `${WIDTH_PX}px`,

  // TODO: RN - unsupported CSS
  // rem are not supported in the interpolated value: __1substitution__rem
  // height: `${HEIGHT_REM}rem`,

  paddingLeft: `-${PADDING_LEFT_PX}px`,
  marginX: '$4',
  marginY: '$40',
});

export const ImplicitRowFlex = Box.withConfig({
  flexDirection: 'row',
  justifyContent: 'center',
});

export const NewPropsToDelete = Box.withConfig({});
