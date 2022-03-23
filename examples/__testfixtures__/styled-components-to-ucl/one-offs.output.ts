import { Box, Header } from '@rbilabs/universal-components';

export const One = Box.withConfig({
  padding: '$4',
});

export const WhiteSpace = Header.withConfig({
  fontSize: 12,
  isTruncated: true,
  variant: 'headerTwo',
})

export const TextOverflow = Header.withConfig({
  fontSize: 12,
  isTruncated: true,
  variant: 'headerTwo',
})

export const Overflow = Header.withConfig({
  fontSize: 12,
  overflow: 'hidden',
  variant: 'headerTwo',
})

export const OverflowXY = Box.withConfig({
  padding: '$4',
});
