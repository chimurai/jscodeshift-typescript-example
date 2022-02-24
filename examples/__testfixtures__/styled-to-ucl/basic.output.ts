import styled, { css } from 'styled-components';

/**
 * Spreads children horizontally and centers them vertically
 */
export const SpreadContentContainer = Box.withConfig((props) => ({
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  textAlign: "left",
  color: Styles.color.black,
  backgroundColor: props.backgroundColor
}));

export const Another = Box.withConfig({
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  textAlign: "left"
});
