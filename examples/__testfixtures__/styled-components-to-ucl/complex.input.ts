import styled from 'styled-components';

import CloseButton from 'components/close-button';
import { FIXED_STICKY_FOOTER_HEIGHT } from 'components/sticky-footer/constants';
import { primitive } from 'styles/constants/primitives';

export const ModalCloseButton = styled(CloseButton)`
  padding-top: ${primitive.$spacing11};
  left: calc(1.25rem + env(safe-area-inset-left));
  position: fixed;
  top: calc(1rem + env(safe-area-inset-top));
  z-index: ${Styles.zIndex.below};
  color: ${p => p.theme.token('text-button-primary')};
  background: transparent;
`;

export const Background = styled.div`
  position: relative;
  background: ${({ theme }) => theme.token('background-pattern')};
`;

export const AllModalContent = styled.div`
  background-color: ${p => p.theme.token('background-pattern')};
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
`;

export const RewardCategoriesContainer = styled.div`
  padding-top: ${primitive.$spacing11};
  ${Styles.mobile`
    padding-bottom: calc(env(safe-area-inset-bottom) + ${FIXED_STICKY_FOOTER_HEIGHT} + 2rem);
  `}
`;
