import { Pressable } from 'react-native';

type Props = {
    onPress: () => void;
}

export function ReferencedProps({onPress}: Props) {
    return <Pressable onPress={onPress} />;
}

export function InlineProps({onPress}: {onPress: () => void}) {
    return <Pressable onPress={onPress} />;
}