import styled from 'styled-components'

const WIDTH_PX = 12;
const HEIGHT_REM = 2;
const PADDING_LEFT_PX = 4;

export const InterpolatedVariables = styled.div`
  width: ${WIDTH_PX}px;
  height: ${HEIGHT_REM}rem;
  padding-top: ${HEIGHT_REM}vh;
  padding-bottom: ${HEIGHT_REM}vw;
  padding-left: -${PADDING_LEFT_PX}px;
  margin: 10rem ${primitive.$spacing4};
`;

export const ImplicitRowFlex = styled.div`
  display: flex;
  justify-content: center;
`;

export const NewPropsToDelete = styled.div`
  appearance: none;
`;
