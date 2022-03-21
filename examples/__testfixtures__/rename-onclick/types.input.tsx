import { Pressable } from 'react-native';

type Props = {
    onClick: () => void;
}

export function ReferencedProps({onClick}: Props) {
    return <Pressable onClick={onClick} />;
}

export function InlineProps({onClick}: {onClick: () => void}) {
    return <Pressable onClick={onClick} />;
}