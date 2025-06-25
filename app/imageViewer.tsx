import { MaterialCommunityIcons, MaterialIcons } from '@expo/vector-icons';
import { ImageZoom } from '@likashefqet/react-native-image-zoom';
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
  Easing,
} from 'react-native-reanimated';
import CustomImage from '~/src/components/CustomImage';
import { BGContainer } from '~/src/components/EnlargeViewNew/bgContainer';
import { BottomBar } from '~/src/components/EnlargeViewNew/bottomBar';
import { TopBar } from '~/src/components/EnlargeViewNew/topBar';
import { DURATION } from '~/src/components/EnlargeViewNew/utils';
import { TouchableIcon } from '~/src/components/TouchableIcon';

const ImageDetails = () => {
  const navigation = useNavigation();

  const { width: w, height: h } = useWindowDimensions();

  // @ts-ignore
  const layout: {
    index: number;
    x: number;
    y: number;
    imgInitialWidth: number;
    imgInitialHeight: number;
  } & Asset = useLocalSearchParams();

  const scaleFactor = w / h;

  let IMAGE_WIDTH = layout.width * scaleFactor;
  let IMAGE_HEIGHT = layout.height * scaleFactor;
  if (layout.width > w) {
    IMAGE_WIDTH = w;
    IMAGE_HEIGHT = (layout.height * w) / layout.width;
  }

  if (IMAGE_HEIGHT > h) {
    IMAGE_HEIGHT = h;
    IMAGE_WIDTH = (layout.width * h) / layout.height;
  }
  const INITIAL_TOP_VALUE = (h - IMAGE_HEIGHT) / 2;
  const INITIAL_LEFT_VALUE = 0;

  // const MAX_ALLOWABLE_UP_MOVEMENT = 50;
  const MAX_ALLOWABLE_DOWN_MOVEMENT = 100;
  const MIN_ALLOWABLE_SCALE_LIMIT = 0.7;

  const x = useSharedValue<number>(layout.x);
  const x_initial = useSharedValue<number>(0);
  const y = useSharedValue<number>(layout.y);
  const y_initial = useSharedValue<number>(0);
  const width = useSharedValue<number>(layout.imgInitialWidth);
  const height = useSharedValue<number>(layout.imgInitialHeight);
  const bgColor = useSharedValue<number>(0);

  const scale = useSharedValue<number>(1);
  const scale_initial = useSharedValue<number>(1);

  const [hideMenus, setHideMenus] = useState(false);
  const [enableTapGesture, setEnableTapGesture] = useState(true);

  const [isScreenReady, setIsScreenReady] = useState(false);

  const tapGesture = Gesture.Tap()
    .onEnd(() => {
      setHideMenus((pre) => !pre);
    })
    .runOnJS(true);

  const panGesture = Gesture.Pan()
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
      y.value = e.translationY + y_initial.value;
      x.value = e.translationX + x_initial.value;
      bgColor.value = 100 - Math.min(100, e.translationY);
    })
    .onEnd((e) => {
      if (scale.value > 1) {
        const scaledWidth = w * scale.value;
        const scaledHeight = h * scale.value;
        const maxTranslationX = (scaledWidth - w) / 2;
        const maxTranslationY = (scaledHeight - h) / 2;

        if (Math.abs(x.value) >= maxTranslationX)
          x.value = withTiming(x.value >= 0 ? maxTranslationX : -maxTranslationX);

        if (Math.abs(y.value) >= maxTranslationY)
          y.value = withTiming(y.value >= 0 ? maxTranslationY : -maxTranslationY);
      } else {
        if (y.value > INITIAL_TOP_VALUE + MAX_ALLOWABLE_DOWN_MOVEMENT) {
          onGoBack();
        } else {
          y.value = withTiming(INITIAL_TOP_VALUE);
          x.value = withTiming(INITIAL_LEFT_VALUE);
          bgColor.value = withTiming(100);
        }
      }
    })
    .runOnJS(true);

  const doubleTapGesture = Gesture.Tap()
    .enabled(enableTapGesture)
    .numberOfTaps(2)
    .maxDuration(250)
    .onStart((e) => {
      if (scale.value > 1) {
        scale.value = withTiming(1, {
          easing: Easing.inOut(Easing.quad),
        });
        x.value = withTiming(0, { duration: DURATION });
        y.value = withTiming(INITIAL_TOP_VALUE, { duration: DURATION });
      } else {
        scale.value = withTiming(2, {
          easing: Easing.inOut(Easing.quad),
        });
      }
    });

  const pinchGesture = Gesture.Pinch()
    .onBegin((event) => {
      scale_initial.value = scale.value;
    })
    .onUpdate((e) => {
      const newScale = scale_initial.value * e.scale;
      if (newScale >= MIN_ALLOWABLE_SCALE_LIMIT) {
        scale.value = newScale;
      }
    })
    .onEnd((e) => {
      scale.value = withTiming(Math.max(1, Math.min(scale.value, 12)));
      x.value = withTiming(0);
      y.value = withTiming(INITIAL_TOP_VALUE);
    });

  useEffect(() => {
    x.value = withTiming(0, { duration: DURATION });
    y.value = withTiming(INITIAL_TOP_VALUE, { duration: DURATION });
    width.value = withTiming(IMAGE_WIDTH, { duration: DURATION });
    height.value = withTiming(IMAGE_HEIGHT, { duration: DURATION });
    bgColor.value = withTiming(100, { duration: DURATION });

    setTimeout(() => {
      setIsScreenReady(true);
    }, DURATION);

    const handler = BackHandler.addEventListener('hardwareBackPress', () => {
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
      // backgroundColor: 'blue',
      transform: [
        {
          scale: scale.value,
        },
      ],
    };
  });

  const onGoBack = () => {
    setIsScreenReady(false);

    bgColor.value = withTiming(0, { duration: DURATION });
    x.value = withTiming(layout.x, { duration: DURATION });
    y.value = withTiming(layout.y, { duration: DURATION });
    width.value = withTiming(layout.imgInitialWidth, { duration: DURATION });
    height.value = withTiming(layout.imgInitialHeight, { duration: DURATION });

    setTimeout(() => {
      navigation.goBack();
      router.setParams({ reset: 'true' });
    }, DURATION);
  };

  const composeTapsGestures = Gesture.Exclusive(doubleTapGesture, tapGesture);
  const composeAllGestures = Gesture.Race(panGesture, pinchGesture, composeTapsGestures);

  // return (
  //   <ImageZoom uri={layout.uri} />
  // )
  return (
    <>
      <GestureDetector gesture={composeAllGestures}>
        <BGContainer sharedValue={bgColor}>
          {/* Main Image */}
          <Animated.View style={animatedStyle}>
            <CustomImage uri={layout.uri} width={'100%'} height={'100%'} resizeMode="cover" />
          </Animated.View>
        </BGContainer>
      </GestureDetector>
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
                setEnableTapGesture(false);
                console.log('first');
                // router.navigate({
                //   pathname: '/imageDetailModal',
                //   params: {
                //     id: layout.id,
                //   },
                // });
                // setEnableTapGesture(true);
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
    </>
  );
};

export default ImageDetails;
