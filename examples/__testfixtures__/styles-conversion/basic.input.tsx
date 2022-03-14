
export const StyledInput = styled.input<IValidationState & IHasFooter>`
  border-radius: ${p =>
    p.hasFooter ? `${Styles.borderRadius} ${Styles.borderRadius} 0 0` : Styles.borderRadius};
  color: ${({ validation }) =>
    validation === FormValidationState.INVALID ? Styles.color.error : Styles.color.black};
  font-family: ${Styles.fontFamily.body};

  :focus {
    outline: none;
    color: ${Styles.color.black};
  }
`;

const Line = ({ text }: { text: string }) => (
  <Box p={2} borderTopWidth={1} borderTopColor={Styles.shadowColor}>
    <Text>{text}</Text>
  </Box>
)

export const theme = {
  activeBorderColor: Styles.color.primary,
  backgroundColor: Styles.color.white,
  birthdayLabelColor: Styles.color.grey.one,
  inactiveBorderColor: Styles.color.grey.four,
  placeholderColor: Styles.color.grey.one,
};
