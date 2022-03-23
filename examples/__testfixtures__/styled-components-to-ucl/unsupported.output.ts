import { Box, FormControl, Input, Text } from '@rbilabs/universal-components';

export const Scrollable = Box.withConfig({});

export const Fieldset = FormControl.withConfig({
  padding: 0,
})/* TODO: RN - This was a <input> tag. Verify its styled properly*/;

export const Container = Box.withConfig({})/* TODO: RN - This was a <ul> tag. Verify its styled properly*/;

export const Label = Text.withConfig({
  // TODO: RN - unsupported CSS
  // display: 'block',
})/* TODO: RN - This was a <label> tag. This should be converted to a UL <FormControl.Label>*/;

export const Group = Box.withConfig({
  // TODO: RN - unsupported CSS
  // listStyle: 'none',
})/* TODO: RN - This was a <li> tag. Verify its styled properly*/;

export const Radio = Input.withConfig({
  position: 'absolute',
  fontFamily: Styles.fontFamily.base,
})/* TODO: RN - This was a <input> tag. Verify its styled properly*/;
