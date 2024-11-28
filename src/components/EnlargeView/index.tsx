import React, { useEffect, useState } from 'react';
import {
  Button,
  ColorValue,
  GestureResponderEvent,
  Pressable,
  StyleSheet,
  useWindowDimensions,
  View,
} from 'react-native';
import { Directions, Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, {
  Extrapolation,
  FadeOut,
  interpolate,
  interpolateColor,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import { TopBar } from './topBar';
import { BottomBar } from './bottomBar';
import { BGContainer } from './bgContainer';

type props = {
  imageSize: number;
  selectedImage: GestureResponderEvent['nativeEvent'] & {
    color: ColorValue;
    uri: string;
  };
  setSelectedImage: any;
  onClose: () => void;
  duration?: number;
};

// const CloseEnlargeContainer = ({ onPress }) => {
//   return <Pressable onPress={onPress} style={{ width: '100%', height: '100%' }} />;
// };

export const EnlargeView = ({
  imageSize,
  onClose,
  selectedImage,
  setSelectedImage,
  duration = 500,
}: props) => {
  const { width, height } = useWindowDimensions();
  const [hideMenus, setHideMenus] = useState(false);
  const [isReady, setIsReady] = useState(false);

  const IMAGE_HEIGHT = height / 3;
  const defalutTopValue = selectedImage.pageY - selectedImage.locationY;
  const defalutLeftValue = selectedImage.pageX - selectedImage.locationX;
  const IMAGE_MARGIN_FROM_TOP = (height - IMAGE_HEIGHT) / 2;

  const updateValue = useSharedValue({ w: 0, h: 0, t: 0, l: 0 });
  // const updateInitialValue = useSharedValue({ w: 0, h: 0, t: 0, l: 0 });

  const scale = useSharedValue(1);
  const scaleInitial = useSharedValue(1);
  const pinchGesture = Gesture.Pinch()
    .onBegin((e) => (scaleInitial.value = scale.value))
    .onUpdate((e) => (scale.value = scaleInitial.value * e.scale))
    .onEnd((e) => (scale.value = withTiming(Math.max(1, Math.min(scale.value, 3)))));

  const flingGesture = Gesture.Fling()
    .direction(Directions.DOWN | Directions.UP)
    .onEnd(() => onCloseView())
    .runOnJS(true);

  const tapGesture = Gesture.Tap()
    .numberOfTaps(1)
    .onStart(() => setHideMenus((pre) => !pre))
    .runOnJS(true);

  const composedGesture = Gesture.Race(tapGesture, pinchGesture);

  const smallToLargeStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: scale.value }],
      width: withTiming(
        interpolate(updateValue.value.w, [0, imageSize], [imageSize, width], Extrapolation.CLAMP)
      ),
      height: withTiming(
        interpolate(
          updateValue.value.h,
          [0, IMAGE_HEIGHT],
          [imageSize, IMAGE_HEIGHT],
          Extrapolation.CLAMP
        )
      ),
      top: withTiming(
        interpolate(
          updateValue.value.t,
          [0, Math.min(defalutTopValue, IMAGE_HEIGHT)],
          [defalutTopValue, IMAGE_MARGIN_FROM_TOP],
          Extrapolation.CLAMP
        )
      ),
      left: withTiming(
        interpolate(
          updateValue.value.l,
          [0, updateValue.value.l],
          [defalutLeftValue, 0],
          Extrapolation.CLAMP
        )
      ),
    };
  });

  useEffect(() => {
    updateValue.value = {
      h: IMAGE_HEIGHT,
      w: width,
      t: IMAGE_MARGIN_FROM_TOP,
      l: defalutLeftValue,
    };
    return () => {
      updateValue.value = { w: 0, h: 0, l: 0, t: 0 };
    };
  }, []);

  useEffect(() => {
    if (selectedImage) {
      setTimeout(() => {
        setIsReady(true);
      }, duration / 2);
    }
  }, [selectedImage]);

  const onCloseView = () => {
    scale.value = 1;
    updateValue.value = {
      w: 0,
      h: 0,
      t: 0,
      l: 0,
    };
    setIsReady(false);

    setTimeout(
      () => {
        onClose();
      },
      scale.value > 1 ? duration : duration / 2
    );
  };

  if (selectedImage)
    return (
      <>
        <GestureDetector gesture={flingGesture}>
          <BGContainer sharedValue={updateValue}>
            <GestureDetector gesture={composedGesture}>
              <Animated.Image
                source={{ uri: selectedImage.uri }}
                // entering={FadeIn.duration(10)}
                exiting={FadeOut.duration(50)}
                style={[
                  {
                    position: 'absolute',
                    alignItems: 'center',
                    justifyContent: 'center',
                    backgroundColor: selectedImage.color,
                  },
                  smallToLargeStyle,
                ]}
              />
            </GestureDetector>
          </BGContainer>
        </GestureDetector>
        {isReady && (
          <View style={StyleSheet.absoluteFillObject}>
            {!hideMenus && (
              <TopBar>
                <Button onPress={() => {}} title="edit" />
                <Button onPress={() => {}} title="info" />
                <Button onPress={() => {}} title="delete" />
              </TopBar>
            )}

            {!hideMenus && (
              <BottomBar>
                <Button onPress={() => {}} title="delete" />
                <Button onPress={() => {}} title="edit" />
                <Button onPress={() => {}} title="info" />
              </BottomBar>
            )}
          </View>
        )}
      </>
    );
};
