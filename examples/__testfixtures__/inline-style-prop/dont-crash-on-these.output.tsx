import { Text } from '@rbilabs/universal-components';
import { style } from 'foo';
import { StyleSheet } from 'react-native';

function C({ propStyle }) {
    return (
        <>
            <Text style={style}>hi</Text>
            <Text style={propStyle}>hi</Text>
            <Text style={[{ height: '$4' }]}>hi</Text>
            <Text style={stylesheet.container}>hi</Text>
        </>
    )
}

const stylesheet = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
