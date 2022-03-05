import styled from 'styled-components';

export const Box = styled.div`
  width: 40;
  height: 4rem;
  flex: 1;
  padding: 12px 4px 12px 1px;
  color: ${Styles.color.grey.four};
  margin: ${primitive.$spacing2} 0;
`;

export const TierLabel = styled.p`
  display: flex;
  position: relative;
  justify-content: center;
  align-items: center;
  top: 0;
  left: 0;
  font: ${brandFont.headerTwo};
  margin: 0;
  line-height: 1px;
  color: ${({ theme }) => theme.token('text-button-secondary')};
  z-index: ${Styles.zIndex.below};
  height: 2rem;
  font-size: 1rem;
`;
