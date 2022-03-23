import { Box } from '@rbilabs/universal-components';

type Baz = true

// Tests to prove we can carry over the types as expected
export const DivWithType = Box.withConfig<Baz>({})
export const DivWithoutType = Box.withConfig({})
export const DivWithInlineType = Box.withConfig<{key: 'property'}>({})