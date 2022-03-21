import { Text } from '@rbilabs/universal-components';

const styles = {
    foo: {
        height: '$4',
    }
}

const textStyle = {
    fontSize: 16
}

function C() {
    return (
        <>
            <Text style={styles.foo}>hi</Text>
            <Text style={textStyle}>hi</Text>
        </>
    );
}