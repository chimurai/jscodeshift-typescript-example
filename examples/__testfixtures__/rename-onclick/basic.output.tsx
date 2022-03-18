import { useEffect } from 'react'
import { Pressable } from 'react-native';

export function InlineHandler() {
    const handlePress = () => {}

    useEffect(() => {

    }, [handlePress])

    return <Pressable onPress={handlePress} />;
}

export function DeconstructedProps({ onPress }) {
    console.log(onPress)

    return <Pressable onPress={onPress} />;
}

export function MemberProps(props) {
    console.log(props.onPress)

    return <Pressable onPress={props.onPress} />;
}