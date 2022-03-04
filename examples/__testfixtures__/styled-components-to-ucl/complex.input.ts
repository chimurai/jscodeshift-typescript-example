import styled, { keyframes } from 'styled-components';

import CloseButton from 'components/close-button';
import { FIXED_STICKY_FOOTER_HEIGHT } from 'components/sticky-footer/constants';
import { primitive } from 'styles/constants/primitives';

const k = keyframes`
  0% {
    opacity: 1;
  }
  100% {
    opacity: 0
  }
`
export const ModalCloseButton = styled(CloseButton)`
  padding-top: ${primitive.$spacing11};
  left: calc(1.25rem + env(safe-area-inset-left));
  position: fixed;
  top: calc(1rem + env(safe-area-inset-top));
  z-index: ${Styles.zIndex.below};
  color: ${p => p.theme.token('text-button-primary')};
  background: transparent;
  animation: ${k} 0.5s;
  animation-fill-mode: both;
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

export const StyledContainer = styled.div`
  height: 88px;
  width: 83px;
  padding: 1rem 2rem;
  margin: 56px;
  object-fit: contain;
  display: block;
`;

export const FlexRemapping = styled.div`
  display: flex;
  justify-content: center;
`;
