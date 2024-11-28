import { StyleSheet, useWindowDimensions } from 'react-native';
import { bgContainerProps } from './types';
import Animated, { interpolateColor, useAnimatedStyle, withTiming } from 'react-native-reanimated';

export const BGContainer = ({ sharedValue, children }: bgContainerProps) => {
  const { width, height } = useWindowDimensions();

  const bgStyle = useAnimatedStyle(() => ({
    backgroundColor: withTiming(
      interpolateColor(sharedValue.value.h, [-200, 0, 200], ['blue', 'transparent', 'black']),
      {
        duration: 400,
      }
    ),
  }));
  return (
    <Animated.View
      style={[
        StyleSheet.absoluteFillObject,
        {
          alignItems: 'center',
          justifyContent: 'center',
        },
        bgStyle,
      ]}>
      {children}
    </Animated.View>
  );
};
