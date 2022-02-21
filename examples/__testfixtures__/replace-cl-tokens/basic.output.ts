

export const MobileHeaderContainer = styled.SafeAreaView<{ reversed?: boolean }>`
  padding-bottom: 0px;
  width: 100%;
  background: ${p =>
    p.reversed
      ? "token.background-hero-reversed"
      : "token.background-hero-light"
  };
  z-index: ${Styles.zIndex.overlay};
`;
