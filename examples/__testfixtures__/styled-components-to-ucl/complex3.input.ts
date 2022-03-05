import styled from 'styled-components';


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

export const ShortCodeErrorContainer = styled.div`
  border: solid 1px ${Styles.color.grey.five};
  padding: 1rem 1.875rem;
  text-align: center;
  border-radius: ${Styles.borderRadius};
  background-color: ${Styles.color.black};
  width: auto;
  min-width: 15.625rem;
  min-height: 6.125rem;

  & > button {
    display: flex;
    font-size: 0.875rem;
    margin: 1rem auto 0;
    padding: 0.7rem 2rem;
    background-color: ${primitive.$white};
    color: ${Styles.color.black};

    svg {
      transform: rotate(50deg);
      width: 0.875rem;
      margin-right: 0.25rem;
    }
  }
`;
