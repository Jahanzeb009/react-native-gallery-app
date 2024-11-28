import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { topBarProps } from './types';
import Animated, { FadeInUp, FadeOutUp } from 'react-native-reanimated';
import { View } from 'react-native';

export const TopBar = ({ children, visible, bgColor, style, ...props }: topBarProps) => {
  const inset = useSafeAreaInsets();
  if (!visible) return null;
  return (
    <Animated.View
      // entering={FadeInUp.delay(100)}
      exiting={FadeOutUp}
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
