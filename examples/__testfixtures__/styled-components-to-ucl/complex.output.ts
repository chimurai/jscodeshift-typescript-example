import { Box } from '@rbilabs/universal-components';

import CloseButton from 'components/close-button';
import { FIXED_STICKY_FOOTER_HEIGHT } from 'components/sticky-footer/constants';
import { primitive } from 'styles/constants/primitives';

export const ModalCloseButton = CloseButton.withConfig({
  paddingTop: '$20',

  // TODO RN: unsupported CSS
  // left: 'calc(1.25rem + env(safe-area-inset-left))',

  position: 'fixed',

  // TODO RN: unsupported CSS
  // top: 'calc(1rem + env(safe-area-inset-top))',

  zIndex: Styles.zIndex.below,
  color: '__legacyToken.text-button-primary',
  background: 'transparent'
});

export const Background = Box.withConfig({
  position: 'relative',
  background: '__legacyToken.background-pattern'
});

export const AllModalContent = Box.withConfig({
  backgroundColor: '__legacyToken.background-pattern',
  width: '100%',
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'space-between'
});

export const RewardCategoriesContainer = Box.withConfig({
  paddingTop: '$20'
});
