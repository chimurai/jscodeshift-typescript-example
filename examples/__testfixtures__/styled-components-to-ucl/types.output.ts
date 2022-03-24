import { Box, makeUclComponent } from '@rbilabs/universal-components';
import Modal from 'modal'

type Baz = true

// Tests to prove we can carry over the types as expected
export const DivWithType = Box.withConfig<Baz>({})
export const DivWithoutType = Box.withConfig({})
export const DivWithInlineType = Box.withConfig<{key: 'property'}>({})
export const DivFnWithInlineType = makeUclComponent(Modal).withConfig<{key: 'property'}>({})