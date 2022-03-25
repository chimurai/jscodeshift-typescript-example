import { Box } from '@rbilabs/universal-components';

const WIDTH_PX = 12;
const HEIGHT_REM = 2;
const PADDING_LEFT_PX = 4;

export const InterpolatedVariables = Box.withConfig({
  width: `${WIDTH_PX}px`,

  // TODO: RN - unsupported CSS
  // rem are not supported in the interpolated value
  // height: `${HEIGHT_REM}rem`,

  // TODO: RN - unsupported CSS
  // vh are not supported in the interpolated value
  // paddingTop: `${HEIGHT_REM}vh`,

  // TODO: RN - unsupported CSS
  // vw are not supported in the interpolated value
  // paddingBottom: `${HEIGHT_REM}vw`,

  paddingLeft: `-${PADDING_LEFT_PX}px`,
  marginX: '$4',
  marginY: '$40',
});

export const ImplicitRowFlex = Box.withConfig({
  flexDirection: 'row',
  justifyContent: 'center',
});

export const NewPropsToDelete = Box.withConfig({});

const i = 1;

export const Units = Box.withConfig({
  // TODO: RN - unsupported CSS
  // rem are not supported in the interpolated value
  // height: `${i}rem`,

  width: `${i}px`,

  // TODO: RN - unsupported CSS
  // em are not supported in the interpolated value
  // paddingTop: `${i}em`,

  // TODO: RN - unsupported CSS
  // vh are not supported in the interpolated value
  // paddingBottom: `${i}vh`,

  // TODO: RN - unsupported CSS
  // vw are not supported in the interpolated value
  // paddingLeft: `${i}vw`,

  paddingRight: `${i}%`,
})