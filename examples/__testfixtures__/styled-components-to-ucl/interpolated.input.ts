import styled from 'styled-components'

const WIDTH_PX = 12;
const HEIGHT_PX = 12;

export const InterpolatedVariables = styled.div`
  width: ${WIDTH_PX}px;
  height: pre${HEIGHT_PX}rem;
  padding: 10rem ${primitive.$spacing4};
`;

export const ImplicitRowFlex = styled.div`
  display: flex;
  justify-content: center;
`;

export const NewPropsToDelete = styled.div`
  appearance: none;
`;
