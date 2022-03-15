function C({ styles }) {
    return (
     <div style={{
      height: '$4',
      width: '83px',
      // TODO: RN - Verify spread does not include invalid props or styles,
      ...styles
     }}>hi</div>
    );
  }