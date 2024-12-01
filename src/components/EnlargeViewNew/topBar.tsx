import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { topBarProps } from '../EnlargeView/types';
import Animated, {
  AnimatedProps,
  FadeInUp,
  FadeOutUp,
  runOnJS,
  SharedValue,
  useDerivedValue,
} from 'react-native-reanimated';
import { View, ViewProps, ViewStyle } from 'react-native';
import { useEffect, useState } from 'react';

export const TopBar = ({
  children,
  visible,
  bgColor,
  style,
  ...props
}: {
  visible: boolean;
  style?: ViewStyle;
  bgColor?: string;
  children: React.ReactNode;
} & AnimatedProps<ViewProps>) => {
  const inset = useSafeAreaInsets();

  if (!visible) return null;
  return (
    <Animated.View
      entering={FadeInUp.delay(100)}
      exiting={FadeOutUp.duration(700)}
      style={{
        top: 0,
        position: 'absolute',
        backgroundColor: bgColor || '#11111190',
      }}>
      <View style={{ height: inset.top, width: '100%' }} />
      <Animated.View
        style={{
          padding: 15,
          width: '100%',
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
        {...props}>
        {children}
      </Animated.View>
    </Animated.View>
  );
};
