import { Box, Header } from '@rbilabs/universal-components';
import Modal from './modal';

/**
 * Spreads children horizontally and centers them vertically
 */
export const Basic = Box.withConfig<{
  color: string,
  backgroundColor: string
}>(p => ({
  display: 'flex',
  alignSelf: 'center',
  justifyContent: 'space-between',
  alignItems: 'center',
  textAlign: 'left',
  color: p.color,
  backgroundColor: p.backgroundColor,
  borderTopWidth: 1,
  borderTopColor: 'solid',
  borderTopStyle: Styles.color.primary
}));

export const Tokens = Box.withConfig({
  alignSelf: 'center',
  color: '__legacyToken.text-reversed',
  backgroundColor: '__legacyToken.background-pattern',
  borderWidth: 2,
  borderColor: 'solid',
  borderStyle: Styles.color.primary
});

export const SubHeader = Header.withConfig({
  color: '__legacyToken.text-reversed'
});

export const Conditional = Box.withConfig<{
  reversed: boolean
}>(p => ({
  color: p.reversed ? '__legacyToken.text-reversed' : '__legacyToken.text-default',
  backgroundColor: p.reversed ? Styles.color.white : '__legacyToken.text-default'
}));

export const ModalExtended = Modal.withConfig({
  backgroundColor: '__legacyToken.background-pattern'
});
