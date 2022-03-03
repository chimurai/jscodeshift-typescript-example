import styled from 'styled-components';

export const Component = styled.div`
  padding: 12px 4px;
  margin: 12px;
  ${Styles.desktop`
    margin: 16px;
  `}
`;

export const Second = styled.div`
  margin: 12px;
  ${Styles.mobile`
    margin: 4px;
  `}
`;
