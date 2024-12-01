import { useSafeAreaInsets } from 'react-native-safe-area-context';

import Animated, {
  AnimatedProps,
  FadeInDown,
  FadeOutDown,
  SharedValue,
} from 'react-native-reanimated';
import { View, ViewProps, ViewStyle } from 'react-native';
import { bottomBarProps } from '../EnlargeView/types';

export const BottomBar = ({
  children,
  bgColor,
  visible,
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
      entering={FadeInDown}
      exiting={FadeOutDown.duration(700)}
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
