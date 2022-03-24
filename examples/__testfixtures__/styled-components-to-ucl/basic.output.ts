import { Box, Header as UCLHeader, makeUclComponent } from '@rbilabs/universal-components';
import Modal from './modal';

/**
 * Spreads children horizontally and centers them vertically
 */
export const Basic = Box.withConfig<{
  color: string;
  backgroundColor: string
}>(p => ({
  flexDirection: 'row',
  alignSelf: 'center',

  // TODO: RN - unsupported CSS
  // transform: 'rotate(180deg) translateX(50%)',

  // TODO: RN - unsupported CSS
  // boxShadow: 'inset 0px 1px 3px 0px rgba(0, 0, 0, 0.1)',

  justifyContent: 'space-between',
  alignItems: 'center',

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
  // TODO: RN - unsupported CSS
  // display: 'block',

  alignSelf: 'center',

  _text: {
    color: '__legacyToken.text-reversed',
    underline: true,
  },

  backgroundColor: '__legacyToken.background-pattern',
  borderWidth: 2,
  borderColor: Styles.color.primary,
  borderStyle: 'solid',
  accessibilityRole: 'header',
});

export const Header = UCLHeader.withConfig({
  color: '__legacyToken.text-reversed',
  underline: false,
  accessibilityLevel: 1,
  variant: 'headerOne',
});

export const Conditional = Box.withConfig<{ reversed: boolean }>(p => ({
  _text: {
    color: p.reversed ? '__legacyToken.text-reversed' : '__legacyToken.text-default',
  },

  backgroundColor: p.reversed ? Styles.color.white : '__legacyToken.text-default',
}));

export const ModalExtended = makeUclComponent(Modal).withConfig({
  backgroundColor: '__legacyToken.background-pattern',
});
