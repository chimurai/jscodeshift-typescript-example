import styled from 'styled-components';

import { primitive } from 'styles/constants/primitives';

export const EqualHalves = styled.div`
  padding: 10rem ${primitive.$spacing4} 0;
  ${Styles.desktop`
    position: relative;
    display: flex;
    width: 50%;
    padding: ${primitive.$spacing11} ${primitive.$spacing8} 0;
  `}
`;

export const ImageHalf = styled(EqualHalves)`
  width: 100%;
  justify-content: center;

  padding: 0 0 0 0rem;

  ${Styles.desktop`
    justify-content: flex-end;
    align-items: flex-end;
    padding: 0;
  `}
`;

export const TextHalf = styled(EqualHalves)`
  z-index: 100;
  padding-top: ${primitive.$spacing9};
  ${Styles.desktop`
    justify-content: flex-start;
    order: 1;
    padding-left: 0;
    padding-bottom: ${primitive.$spacing11};
  `}
`;
