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

export const ItemOfferHeading = styled.span<{ $isApplied: boolean }>`
  font-size: 0.625rem;
  text-transform: uppercase;
  color: ${({ $isApplied }) => ($isApplied ? Styles.color.black : Styles.color.red)};
`

export const Y = styled.div<{ center: boolean, $isApplied: boolean }>`
  color: ${({ $isApplied }) => ($isApplied ? Styles.color.black : Styles.color.red)};
  align-items: ${props => (props.center ? 'center' : 'flex-end')};
`;

export const Z = styled.div<{ center: boolean, $isApplied: boolean }>`
  align-items: ${props => (props.center ? 'center' : 'flex-end')};
  align-self: ${({ center }) => (center ? 'center' : 'flex-end')};
  color: ${({ $isApplied }) => ($isApplied ? Styles.color.black : Styles.color.red)};
`;
