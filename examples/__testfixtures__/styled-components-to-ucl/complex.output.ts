import { Box } from '@rbilabs/universal-components';

import CloseButton from 'components/close-button';
import { FIXED_STICKY_FOOTER_HEIGHT } from 'components/sticky-footer/constants';
import { primitive } from 'styles/constants/primitives';

export const ModalCloseButton = CloseButton.withConfig({
  paddingTop: '$20',

  // TODO: RN - unsupported CSS
  // left: 'calc(1.25rem + env(safe-area-inset-left))',

  // TODO: RN - unsupported CSS
  // position: 'fixed',

  // TODO: RN - unsupported CSS
  // top: 'calc(1rem + env(safe-area-inset-top))',

  zIndex: Styles.zIndex.below,
  color: '__legacyToken.text-button-primary',
  backgroundColor: 'transparent',
});

export const Background = Box.withConfig({
  backgroundColor: '__legacyToken.background-pattern',
});

export const AllModalContent = Box.withConfig({
  backgroundColor: '__legacyToken.background-pattern',
  width: '100%',
  height: '100%',
  justifyContent: 'space-between',
});

export const RewardCategoriesContainer = Box.withConfig({
  paddingTop: '$20',

  // TODO: RN - unsupported CSS
  // paddingBottom: 'calc(env(safe-area-inset-bottom) + __0substitution__ + 2rem)',
});

export const StyledContainer = Box.withConfig({
  height: '88px',
  width: '83px',
  paddingX: '$8',
  paddingY: '$4',
  margin: '$13.5',

  // TODO: RN - unsupported CSS
  // objectFit: 'contain',

  // TODO: RN - unsupported CSS
  // display: 'block',
});

export const FlexRemapping = Box.withConfig({
  alignItems: 'center',
});
