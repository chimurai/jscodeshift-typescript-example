import { Box } from '@rbilabs/universal-components';
function C({ styles }) {
    return (
     <Box style={{
      height: '$4',
      width: '83px',
      // TODO: RN - Verify spread does not include invalid props or styles,
      ...styles,
     }}>hi</Box>
    );
  }