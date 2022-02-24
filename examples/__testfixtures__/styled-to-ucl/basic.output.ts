import styled, { css } from 'styled-components';

/**
 * Spreads children horizontally and centers them vertically
 */
export const SpreadContentContainer = Box.withConfig({
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  textAlign: "left"
});

export const Heading = Box.withConfig({
  fontSize: "1.1rem",
  color: Styles.color.black,
  textAlign: "center"
});

export const Another = Box.withConfig({
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  textAlign: "left"
});
