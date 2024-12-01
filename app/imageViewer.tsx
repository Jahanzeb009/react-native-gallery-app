import { MaterialCommunityIcons, MaterialIcons } from '@expo/vector-icons';
import { useNavigation, useRoute } from '@react-navigation/native';
import { Image } from 'expo-image';
import { Asset, getAssetInfoAsync } from 'expo-media-library';
import { router, useLocalSearchParams } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { View, Text, BackHandler, Button, useWindowDimensions, StyleSheet } from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  interpolate,
  interpolateColor,
  Extrapolation,
  FadeOut,
  FadeIn,
  withSpring,
  runOnJS,
  runOnUI,
} from 'react-native-reanimated';
import { BGContainer } from '~/src/components/EnlargeViewNew/bgContainer';
import { BottomBar } from '~/src/components/EnlargeViewNew/bottomBar';
import { TopBar } from '~/src/components/EnlargeViewNew/topBar';
import { DURATION } from '~/src/components/EnlargeViewNew/utils';
import { TouchableIcon } from '~/src/components/TouchableIcon';

const ImageDetails = () => {
  const navigation = useNavigation();

  const { width: w, height: h } = useWindowDimensions();

  const IMAGE_WIDTH = w;
  const IMAGE_HEIGHT = h * 0.6;
  const INITIAL_TOP_VALUE = -(IMAGE_HEIGHT - h) / 2;
  const INITIAL_LEFT_VALUE = 0;

  const MAX_ALLOWABLE_UP_MOVEMENT = 50;
  const MAX_ALLOWABLE_DOWN_MOVEMENT = 100;
  const MIN_ALLOWABLE_SCALE_LIMIT = 0.7;

  // @ts-ignore
  const layout: {
    index: number;
    x: number;
    y: number;
    width: number;
    height: number;
  } & Asset = useLocalSearchParams();

  const x = useSharedValue<number>(layout.x);
  const x_initial = useSharedValue<number>(0);
  const y = useSharedValue<number>(layout.y);
  const y_initial = useSharedValue<number>(0);
  const width = useSharedValue<number>(layout.width);
  const height = useSharedValue<number>(layout.height);
  const bgColor = useSharedValue<number>(0);

  const scale = useSharedValue<number>(1);
  const scale_initial = useSharedValue<number>(1);

  const [hideMenus, setHideMenus] = useState(false);

  const [isScreenReady, setIsScreenReady] = useState(false);

  const tapGesture = Gesture.Tap()
    .onEnd(() => {
      setHideMenus((pre) => !pre);
    })
    .runOnJS(true);

  const panGestuer = Gesture.Pan()
    .onBegin((e) => {
      if (scale.value > 1) {
        x_initial.value = Number(x.value);
        y_initial.value = Number(y.value);
      } else {
        y_initial.value = Number(y.value);
        x_initial.value = Number(x.value);
      }
    })
    .onUpdate((e) => {
      // if (scale.value > 1) {
      // x.value = e.translationX + x_initial.value;
      // y.value = e.translationY + y_initial.value;
      // } else {
      y.value = e.translationY + y_initial.value;
      x.value = e.translationX + x_initial.value;
      // }

      if (e.translationY + y_initial.value <= INITIAL_TOP_VALUE - 40) {
        router.navigate({
          pathname: '/imageDetailModal',
          params: {
            id: layout.id,
          },
        });
      }
    })
    .onEnd(() => {
      if (scale.value > 1) {
        const scaledWidth = w * scale.value;
        const scaledHeight = h * scale.value;
        const maxTranslationX = (scaledWidth - w) / 2;
        const maxTranslationY = (scaledHeight - h) / 2;

        if (Math.abs(x.value) >= maxTranslationX)
          x.value = withSpring(x.value >= 0 ? maxTranslationX : -maxTranslationX);

        if (Math.abs(y.value) >= maxTranslationY)
          y.value = withSpring(y.value >= 0 ? maxTranslationY : -maxTranslationY);
      } else {
        if (y.value > INITIAL_TOP_VALUE + MAX_ALLOWABLE_DOWN_MOVEMENT) {
          onGoBack();
        } else {
          y.value = withTiming(INITIAL_TOP_VALUE);
          x.value = withTiming(INITIAL_LEFT_VALUE);
        }
      }
    })
    .runOnJS(true);

  const doubleTapGestuer = Gesture.Tap()
    .numberOfTaps(2)
    .onEnd(() => {
      if (scale.value > 1) {
        scale.value = 1;
        x.value = withTiming(0, { duration: DURATION });
        y.value = withTiming(INITIAL_TOP_VALUE, { duration: DURATION });
      } else {
        scale.value = 2;
      }
    });

  const pinchGesture = Gesture.Pinch()
    .onBegin((e) => (scale_initial.value = scale.value))
    .onUpdate((e) => {
      const newScale = scale_initial.value * e.scale;
      if (newScale >= MIN_ALLOWABLE_SCALE_LIMIT) {
        scale.value = scale_initial.value * e.scale;
      }
    })
    .onEnd((e) => {
      scale.value = withTiming(Math.max(1, Math.min(scale.value, 12)));
      x.value = withTiming(0);
      y.value = withTiming(INITIAL_TOP_VALUE);
    });
// console.log(layout)
  useEffect(() => {
    x.value = withTiming(0, { duration: DURATION });
    y.value = withTiming(INITIAL_TOP_VALUE, { duration: DURATION });
    width.value = withTiming(IMAGE_WIDTH, { duration: DURATION });
    height.value = withTiming(IMAGE_HEIGHT, { duration: DURATION });
    bgColor.value = withTiming(1, { duration: DURATION });

    setTimeout(() => {
      setIsScreenReady(true);
    }, DURATION);

    const handler = BackHandler.addEventListener('hardwareBackPress', () => {
      console.log('first')
      onGoBack();
      return true;
    });

    return () => {
      handler.remove();
    };
  }, []);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      left: x.value,
      top: y.value,
      width: width.value,
      position: 'absolute',
      height: height.value,
      transform: [
        {
          scale: withSpring(scale.value, {
            damping: 15, // Higher value reduces bounce
            stiffness: 100, // Lower value makes the animation softer
            mass: 1, // Controls the weight of the animation
            overshootClamping: false, // Allow a small overshoot
            restSpeedThreshold: 0.01, // Threshold for stopping the animation
            restDisplacementThreshold: 0.01, // Threshold for resting position
          }),
        },
      ],
      // backgroundColor: '#118',
    };
  });

  const onGoBack = () => {
    console.log('-________')
    setIsScreenReady(false);

    bgColor.value = withTiming(0, { duration: DURATION });
    x.value = withTiming(layout.x, { duration: DURATION });
    y.value = withTiming(layout.y, { duration: DURATION });
    width.value = withTiming(layout.width, { duration: DURATION });
    height.value = withTiming(layout.height, { duration: DURATION });

    setTimeout(() => {
      navigation.goBack();
    }, DURATION);
  };

  const composeTapsGestures = Gesture.Exclusive(doubleTapGestuer, tapGesture);
  const composeAllGestures = Gesture.Race(panGestuer, pinchGesture, composeTapsGestures);

  return (
    <GestureDetector gesture={composeAllGestures}>
      <BGContainer sharedValue={bgColor}>
        {/* Main Image */}
        <Animated.View style={animatedStyle}>
          <Image
            source={{ uri: layout.uri }}
            style={{ width: '100%', height: '100%' }}
            contentFit="contain"
          />
        </Animated.View>

        {isScreenReady && (
          <Animated.View entering={FadeIn} exiting={FadeOut} style={StyleSheet.absoluteFillObject}>
            <TopBar visible={!hideMenus}>
              <TouchableIcon
                onPress={onGoBack}
                icon={<MaterialIcons name="arrow-back" size={24} color="white" />}
              />

              <Text style={{ color: 'white' }}>{layout?.filename.split('.')[0]}</Text>
              <TouchableIcon
                onPress={onGoBack}
                icon={<MaterialCommunityIcons name="close" size={24} color="white" />}
              />
            </TopBar>

            <BottomBar visible={!hideMenus}>
              <TouchableIcon
                onPress={async () => {
                  router.navigate({
                    pathname: '/imageDetailModal',
                    params: {
                      id: layout.id,
                    },
                  });
                }}
                icon={<MaterialIcons name="info-outline" size={24} color="white" />}
              />
              <TouchableIcon
                onPress={() => {}}
                icon={<MaterialIcons name="edit" size={24} color="white" />}
              />
              <TouchableIcon
                onPress={() => {}}
                icon={<MaterialCommunityIcons name="delete-outline" size={24} color="white" />}
              />
            </BottomBar>
          </Animated.View>
        )}
        {/* 
        <Button title="back" onPress={onGoBack} /> */}
      </BGContainer>
    </GestureDetector>
  );
};

export default ImageDetails;
