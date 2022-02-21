import { Box } from '@rbilabs/universal-components';

/**
 * Spreads children horizontally and centers them vertically
 */
export const SpreadContentContainer = Box.withConfig(`
  display: flex;
  justify-content: space-between;
  align-items: center;
  text-align: left;
`);

// /**
//  * Displays a + or X Icon depending on whether or not it's active.
//  */
// export const AccordionActivatorPlus = styled.div<{ $isActive?: boolean }>`
//   transition: transform 0.1s linear;

//   ${props =>
//     props.$isActive &&
//     css`
//       transform: rotateZ(45deg);
//     `}
// `;
// /**
//  * Displays a wide dropdown arrow Icon
//  * rotates depending on whether or not it's active.
//  */
// export const AccordionActivatorArrow = styled.div<{ $isActive?: boolean }>`
//   transition: transform 0.2s linear;
//   transform: rotateZ(90deg);

//   ${props =>
//     props.$isActive &&
//     css`
//       transform: rotateZ(270deg);
//     `}
// `;

// /**
//  * Adds space for an Accordion Item's content.
//  */
// export const AccordionContentWrapper = styled.div`
//   margin: 2rem 1rem 1rem 0;
//   padding-left: 2rem;
//   padding-right: 2rem;
//   width: 100%;
// `;

// /**
//  * Unstyled button for triggering Accordion dropdowns.
//  */
// export const AccordionActivatorButton = styled.button`
//   display: block;
//   width: 100%;
//   margin: 0;
//   padding: 0;
//   border: 0;
//   outline: 0;
//   padding: 1rem 2rem;

//   background: transparent;
//   cursor: pointer;
// `;
