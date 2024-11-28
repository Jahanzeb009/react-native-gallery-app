import React from "react";
import { ViewProps, ViewStyle } from "react-native";
import { AnimatedProps, SharedValue } from "react-native-reanimated";

type topBarProps = {
    style?: ViewStyle;
    children: React.ReactNode;
} & AnimatedProps<ViewProps>;

type bottomBarProps = {
    style?: ViewStyle;
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