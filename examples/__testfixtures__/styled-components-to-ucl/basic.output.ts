import { Box, Header as UCLHeader } from '@rbilabs/universal-components';
import Modal from './modal';

/**
 * Spreads children horizontally and centers them vertically
 */
export const Basic = Box.withConfig<{
  color: string,
  backgroundColor: string
}>(p => ({
  alignSelf: 'center',
  alignItems: 'space-between',
  justifyContent: 'center',

  _text: {
    textAlign: 'left',
    color: p.color,
  },

  backgroundColor: p.backgroundColor,
  borderTopWidth: 1,
  borderTopColor: Styles.color.primary,
  borderTopStyle: 'solid',
}));

export const Tokens = Box.withConfig({
  // TODO RN: unsupported CSS
  // display: 'block',

  alignSelf: 'center',

  _text: {
    color: '__legacyToken.text-reversed',
  },

  backgroundColor: '__legacyToken.background-pattern',
  borderWidth: 2,
  borderColor: Styles.color.primary,
  borderStyle: 'solid',
});

export const Header = UCLHeader.withConfig({
  color: '__legacyToken.text-reversed',
});

export const Conditional = Box.withConfig<{
  reversed: boolean
}>(p => ({
  _text: {
    color: p.reversed ? '__legacyToken.text-reversed' : '__legacyToken.text-default',
  },

  backgroundColor: p.reversed ? Styles.color.white : '__legacyToken.text-default',
}));

export const ModalExtended = Modal.withConfig({
  backgroundColor: '__legacyToken.background-pattern',
});
