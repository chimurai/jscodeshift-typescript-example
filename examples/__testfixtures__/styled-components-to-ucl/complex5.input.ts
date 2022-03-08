import styled from 'styled-components';

export const UnauthenticatedContainer = styled.div<{ center: boolean }>`
  padding: 1rem 0;
  display: flex;
  flex-flow: row wrap;
  align-items: ${props => (props.center ? 'center' : 'flex-end')};
  ${Styles.desktop`
    align-items: center;
  `}
`;
