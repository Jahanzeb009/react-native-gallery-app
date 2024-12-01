import { useNavigation, useRoute } from '@react-navigation/native';
import { useLocalSearchParams } from 'expo-router';
import React, { useEffect } from 'react';
import { View, Text, BackHandler, Button, useWindowDimensions } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  interpolate,
  interpolateColor,
  Extrapolation,
} from 'react-native-reanimated';

const DURATION = 1000;

const Second = () => {
  const navigation = useNavigation();

  const route = useRoute();
  // console.log(route.params?.layout?.x);
  const layout: any = useLocalSearchParams();

  // return

  // Shared values for animation
  const x = useSharedValue<number>(layout.x);
  const y = useSharedValue<number>(layout.y);
  const width = useSharedValue<number>(layout.width);
  const height = useSharedValue<number>(layout.height);
  const bgColor = useSharedValue<number>(0);

  const { width: w, height: h } = useWindowDimensions();

  const IMAGE_WIDTH = w;
  const IMAGE_HEIGHT = h * 0.6;

  useEffect(() => {
    // Animate forward to new position and size
    x.value = withTiming(0, { duration: DURATION }); // New X position
    y.value = withTiming(-(IMAGE_HEIGHT - h) / 2, { duration: DURATION }); // New Y position
    width.value = withTiming(IMAGE_WIDTH, { duration: DURATION }); // New width
    height.value = withTiming(IMAGE_HEIGHT, { duration: DURATION }); // New height
    bgColor.value = withTiming(1, { duration: DURATION });

    const handler = BackHandler.addEventListener('hardwareBackPress', () => {
      bgColor.value = withTiming(0);
      x.value = withTiming(layout.x);
      y.value = withTiming(layout.y);
      width.value = withTiming(layout.width);
      height.value = withTiming(layout.height);

      setTimeout(() => {
        navigation.goBack();
      }, 300);
      return true;
    });

    //     const sub = navigation.addListener("beforeRemove", (e) => {
    //       e.preventDefault()
    //       x.value = withTiming(layout.x);
    //       y.value = withTiming(layout.y);
    //       width.value = withTiming(layout.width);
    //       height.value = withTiming(layout.height);
    //       bgColor.value = withTiming(0);
    // e.defaultPrevented
    //       setTimeout(() => {
    //         navigation.goBack();
    //       }, 300);
    //     });

    return () => {
      handler.remove();
      // sub();
    };

    // return unsubscribe; // Clean up the listener
  }, []);

  const animatedStyle = useAnimatedStyle(() => ({
    position: 'absolute',
    left: x.value,
    top: y.value,
    width: width.value,
    height: height.value,
    backgroundColor: 'blue',
    // backgroundColor: withTiming(interface()),
  }));

  const mainBgStyle = useAnimatedStyle(() => {
    return {
      backgroundColor: interpolateColor(bgColor.value, [0, 1], ['transparent', 'black']),
    };
  });

  return (
    <Animated.View
      style={[
        {
          flex: 1,
          // backgroundColor: "black",
          alignItems: 'center',
          justifyContent: 'center',
        },
        mainBgStyle,
      ]}>
      <Animated.Image
        source={{
          uri: layout.uri,
        }}
        style={animatedStyle}
      />
      <Button
        title="back"
        onPress={() => {
          x.value = withTiming(layout.x);
          y.value = withTiming(layout.y);
          width.value = withTiming(layout.width);
          height.value = withTiming(layout.height);
          bgColor.value = withTiming(0);
        }}
      />
    </Animated.View>
  );
};

export default Second;
