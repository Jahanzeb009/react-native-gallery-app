import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { bottomBarProps } from './types';
import Animated, { FadeInDown, FadeOutDown } from 'react-native-reanimated';

export const BottomBar = ({ children, style, ...props }: bottomBarProps) => {
  const inset = useSafeAreaInsets();
  return (
    <Animated.View
      entering={FadeInDown}
      exiting={FadeOutDown}
      style={[
        {
          bottom: 0,
          padding: 15,
          width: '100%',
          position: 'absolute',
          flexDirection: 'row',
          backgroundColor: '#111111',
          paddingBottom: inset.bottom,
          justifyContent: 'space-between',
        },
        style,
      ]}
      {...props}>
      {children}
    </Animated.View>
  );
};
