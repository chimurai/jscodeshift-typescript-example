import styled from 'styled-components';
import Modal from 'modal'

type Baz = true

// Tests to prove we can carry over the types as expected
export const DivWithType = styled.div<Baz>``
export const DivWithoutType = styled.div``
export const DivWithInlineType = styled.div<{key: 'property'}>``
export const DivFnWithInlineType = styled(Modal)<{key: 'property'}>``