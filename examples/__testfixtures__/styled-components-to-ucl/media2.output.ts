import { Box } from '@rbilabs/universal-components';

import { primitive } from 'styles/constants/primitives';

export const EqualHalves = Box.withConfig({
  width: {
    lg: '50%',
  },

  paddingTop: {
    base: '$40',
    lg: '$20',
  },

  paddingRight: {
    base: '$4',
    lg: '$10',
  },

  paddingBottom: {
    base: 0,
    lg: 0,
  },

  paddingLeft: {
    base: '$4',
    lg: '$10',
  },
});

export const ImageHalf = EqualHalves.withConfig({
  width: '100%',
  paddingTop: 0,
  paddingRight: 0,
  paddingBottom: 0,
  paddingLeft: 0,

  justifyContent: {
    base: 'center',
    lg: 'flex-end',
  },

  alignItems: {
    lg: 'flex-end',
  },

  padding: {
    lg: 0,
  },
});

export const TextHalf = EqualHalves.withConfig({
  paddingTop: '$12',

  justifyContent: {
    lg: 'flex-start',
  },

  paddingLeft: {
    lg: 0,
  },

  paddingBottom: {
    lg: '$20',
  },
})/*
TODO RN: unsupported CSS
Some attributes were not converted.

export const TextHalf = styled(EqualHalves)`
  z-index: 100;
  padding-top: ${primitive.$spacing9};
  ${Styles.desktop`
    justify-content: flex-start;
    order: 1;
    padding-left: 0;
    padding-bottom: ${primitive.$spacing11};
  `}
`;

*/;
