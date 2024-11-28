import React from "react";
import { ViewProps, ViewStyle } from "react-native";
import { AnimatedProps, SharedValue } from "react-native-reanimated";

type topBarProps = {
    visible: boolean;
    style?: ViewStyle;
    bgColor?: string;
    children: React.ReactNode;
} & AnimatedProps<ViewProps>;

type bottomBarProps = {
    visible: boolean;
    style?: ViewStyle;
    bgColor?: string;
    children: React.ReactNode;
} & AnimatedProps<ViewProps>;

type bgContainerProps = {
    sharedValue: SharedValue<{
        w: number;
        h: number;
        t: number;
        l: number
    }>;
    children: React.ReactNode;
}

export {
    topBarProps,
    bottomBarProps,
    bgContainerProps
}