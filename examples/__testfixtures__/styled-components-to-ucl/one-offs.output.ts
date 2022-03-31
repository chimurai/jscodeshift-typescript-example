import { Box, Header } from '@rbilabs/universal-components';

export const One = Box.withConfig({
  padding: '$4',
});

export const WhiteSpace = Header.withConfig({
  fontSize: 'xs',
  isTruncated: true,
  variant: 'headerTwo',
})

export const TextOverflow = Header.withConfig({
  fontSize: 'xs',
  isTruncated: true,
  variant: 'headerTwo',
})

export const Overflow = Header.withConfig({
  fontSize: 'xs',
  overflow: 'hidden',
  variant: 'headerTwo',
})

export const OverflowXY = Box.withConfig({
  // TODO: RN - unsupported CSS
  // overflowY: 'auto',

  // TODO: RN - unsupported CSS
  // overflowX: 'hidden',

  padding: '$4',
});
