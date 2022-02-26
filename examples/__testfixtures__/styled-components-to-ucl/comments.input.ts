import styled from 'styled-components';

const StyledContainer = styled.div`
  height: 32px;
  // Inline comment
  width: 140px;
  margin: 9px auto 0;
  z-index: ${Styles.zIndex.top};
  /*
   We want Reach Router's Link component to handle the onClick event.
   Setting 'pointer-events' to 'none' ensures that this component,
   or its children, don't intercept the clicks.
   */
  pointer-events: none;
`;

export default StyledContainer;
