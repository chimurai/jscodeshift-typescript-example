import { Text } from '@rbilabs/universal-components';

const styles = {
    foo: {
        height: '1rem',
    }
}

const textStyle = {
    display: 'flex',
    alignItems: 'center',
}

function C() {
    return (
        <>
            <Text style={styles.foo}>hi</Text>
            <Text style={textStyle}>hi</Text>
        </>
    );
}