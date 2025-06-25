import { StyleSheet, useWindowDimensions } from 'react-native';

import Animated, {
  interpolateColor,
  SharedValue,
  useAnimatedStyle,
  withTiming,
} from 'react-native-reanimated';
import { bgContainerProps } from '../EnlargeView/types';
import { DURATION } from './utils';

export const BGContainer = ({
  sharedValue,
  children,
}: {
  sharedValue: SharedValue<number>;
  children: React.ReactNode;
}) => {
  // const { width, height } = useWindowDimensions();

  const bgStyle = useAnimatedStyle(() => ({
    // @ts-ignore
    backgroundColor: interpolateColor(sharedValue.value, [0, 100], ['transparent', 'black']),
  }));
  return (
    <Animated.View
      style={[
        {
          flex: 1,
          alignItems: 'center',
          justifyContent: 'center',
        },
        bgStyle,
      ]}>
      {children}
    </Animated.View>
  );
};
