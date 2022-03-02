import styled from 'styled-components';

export const Component = styled.div`
  padding: 12px;
  background-color: ${p => p.theme.token('background-button-primary-default')};
  &:hover {
    padding: 24px;
    background-color: ${p => p.theme.token('background-button-primary-hover')};
  }
`;
