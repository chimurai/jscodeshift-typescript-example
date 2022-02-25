import { Box, Header } from '@rbilabs/universal-components';

/**
 * Spreads children horizontally and centers them vertically
 */
export const Basic = Box.withConfig<{
  color: string,
  backgroundColor: string
}>(p => ({
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  textAlign: 'left',
  color: p.color,
  backgroundColor: p.backgroundColor
}));

export const Tokens = Box.withConfig({
  color: '__legacyToken.text-reversed',
  backgroundColor: '__legacyToken.background-pattern'
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
