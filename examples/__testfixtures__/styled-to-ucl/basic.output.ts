import styled, { css } from 'styled-components';

/**
 * Spreads children horizontally and centers them vertically
 */
export const SpreadContentContainer = Box.withConfig<{
  backgroundColor: string,
  color: string
}>(p => ({
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  textAlign: "left",
  color: p.color,
  backgroundColor: p.backgroundColor
}));

export const Another = Box.withConfig({
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  color: Styles.color.black,
  textAlign: "left"
});
