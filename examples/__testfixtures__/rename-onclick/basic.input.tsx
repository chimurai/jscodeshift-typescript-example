import { useEffect } from 'react'
import { Pressable } from 'react-native';

export function InlineHandler() {
    const handleClick = () => {}

    useEffect(() => {

    }, [handleClick])

    return <Pressable onClick={handleClick} />;
}

export function DeconstructedProps({ onClick }) {
    console.log(onClick)

    return <Pressable onClick={onClick} />;
}

export function MemberProps(props) {
    console.log(props.onClick)

    return <Pressable onClick={props.onClick} />;
}