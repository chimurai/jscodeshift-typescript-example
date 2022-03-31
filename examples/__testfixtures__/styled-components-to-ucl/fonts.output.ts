import { Header, Text } from '@rbilabs/universal-components';

export const One = Text.withConfig({
  fontSize: 'xs',
  fontWeight: 400,
});

export const Two = Text.withConfig({
  fontSize: '4xl',
  fontWeight: 700,
});

export const Three = Header.withConfig({
  fontSize: '9xl',
  fontWeight: 700,
  accessibilityLevel: 1,
  variant: 'headerOne',
});

export const Four = Header.withConfig({
  fontSize: '3xl',
  fontWeight: 700,
  accessibilityLevel: 1,
  variant: 'headerOne',
});

export const Five = Header.withConfig({
  fontSize: 'lg',
  fontWeight: 400,
  variant: 'headerTwo',
});

export const Unsupported = Header.withConfig({
  fontSize: 'lg',

  // TODO: RN - unsupported CSS
  // fontWeight: 'fake',

  variant: 'headerTwo',
});
