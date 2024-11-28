import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { topBarProps } from './types';
import Animated, { FadeInUp, FadeOutUp } from 'react-native-reanimated';

export const TopBar = ({ children, style, ...props }: topBarProps) => {
  const inset = useSafeAreaInsets();
  return (
    <Animated.View
      entering={FadeInUp}
      exiting={FadeOutUp}
      style={{
        top: 0,
        padding: 15,
        width: '100%',
        position: 'absolute',
        flexDirection: 'row',
        paddingTop: inset.top,
        backgroundColor: '#11111190',
        justifyContent: 'space-between',
      }}
      {...props}>
      {children}
    </Animated.View>
  );
};
