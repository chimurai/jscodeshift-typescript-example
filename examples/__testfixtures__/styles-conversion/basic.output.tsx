export const StyledInput = styled.input<IValidationState & IHasFooter>`
  border-radius: ${p =>
    p.hasFooter ? `${Styles.borderRadius} ${Styles.borderRadius} 0 0` : Styles.borderRadius};
  color: ${({ validation }) =>
    validation === FormValidationState.INVALID ? example.error : example.black};
  font-family: ${Styles.fontFamily.body};

  :focus {
    outline: none;
    color: ${example.black};
  }
`;

const Line = ({ text }: { text: string }) => (
  <Box p={2} borderTopWidth={1} borderTopColor={Styles.shadowColor}>
    <Text>{text}</Text>
  </Box>
)

export const theme = {
  activeBorderColor: example.primary,
  backgroundColor: example.white,
  birthdayLabelColor: example.grey.one,
  inactiveBorderColor: example.grey.four,
  placeholderColor: example.grey.one,
};
