import { Text } from '@rbilabs/universal-components';

const styles = {
    foo: {
        height: '$4',
    }
}

const textStyle = {
    justifyContent: 'center',
}

function C() {
    return (
        <>
            <Text style={styles.foo}>hi</Text>
            <Text style={textStyle}>hi</Text>
        </>
    );
}