import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { bottomBarProps } from './types';
import Animated, { FadeInDown, FadeOutDown } from 'react-native-reanimated';
import { View } from 'react-native';

export const BottomBar = ({ children, bgColor, visible, style, ...props }: bottomBarProps) => {
  const inset = useSafeAreaInsets();
  if (!visible) return null;
  return (
    <Animated.View
      // entering={FadeInDown}
      exiting={FadeOutDown}
      style={{
        bottom: 0,
        position: 'absolute',
        backgroundColor: bgColor || '#111111',
      }}>
      <Animated.View
        style={[
          {
            padding: 15,
            width: '100%',
            alignItems: 'center',
            flexDirection: 'row',
            justifyContent: 'space-between',
          },
          style,
        ]}
        {...props}>
        {children}
      </Animated.View>
      <View style={{ height: inset.bottom, width: '100%' }} />
    </Animated.View>
  );
};
