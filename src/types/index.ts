import { Asset } from "expo-media-library";
import { ColorValue, GestureResponderEvent } from "react-native";

type enlargeViewProps = {
    imageSize: number;
    selectedImage: GestureResponderEvent['nativeEvent'] & Asset
    onClose: () => void;
    duration?: number;
};

export {
    enlargeViewProps
};