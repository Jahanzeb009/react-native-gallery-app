import React, { useEffect, useRef, useState } from 'react';
import {
  Alert,
  Button,
  ColorValue,
  GestureResponderEvent,
  Pressable,
  StyleSheet,
  Text,
  TouchableOpacity,
  useWindowDimensions,
  View,
} from 'react-native';
import { Directions, Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, {
  Extrapolation,
  FadeOut,
  interpolate,
  interpolateColor,
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import { TopBar } from './topBar';
import { BottomBar } from './bottomBar';
import { Image } from 'expo-image';
import { MaterialCommunityIcons, MaterialIcons } from '@expo/vector-icons';
import { StatusBar } from 'expo-status-bar';
import { TouchableIcon } from '../TouchableIcon';
import { enlargeViewProps } from '~/src/types';
import { AssetInfo, getAssetInfoAsync } from 'expo-media-library';
import EnlargeViewSheet from './enlargeViewSheet';
import BottomSheet, { BottomSheetModal } from '@gorhom/bottom-sheet';
import { BGContainer } from './bgContainer';

export const EnlargeView = ({
  onClose,
  imageSize,
  selectedImage,
  duration = 500,
}: enlargeViewProps) => {
  const { width, height } = useWindowDimensions();
  const [hideMenus, setHideMenus] = useState(false);
  const [isReady, setIsReady] = useState(false);
  const [enablePanGesture, setEnablePanGesture] = useState(false);
  const [imageDetails, setImageDetails] = useState<AssetInfo>();

  const bottomSheetRef = useRef<BottomSheetModal>(null);

  const IMAGE_HEIGHT = height / 1.5;
  const defalutTopValue = selectedImage.pageY - selectedImage.locationY;
  const defalutLeftValue = selectedImage.pageX - selectedImage.locationX;
  const IMAGE_MARGIN_FROM_TOP = (height - IMAGE_HEIGHT) / 2;

  const updateValue = useSharedValue({ w: 0, h: 0, t: 0, l: 0 });
  const updateInitialValue = useSharedValue({ w: 0, h: 0, t: 0, l: 0 });

  const scale = useSharedValue(1);
  const scaleInitial = useSharedValue(1);
  const pinchGesture = Gesture.Pinch()
    .onBegin((e) => (scaleInitial.value = scale.value))
    .onUpdate((e) => {
      const newScale = scaleInitial.value * e.scale;
      if (newScale >= 0.7) {
        scale.value = scaleInitial.value * e.scale;
      }
    })
    .onEnd((e) => {
      scale.value = withTiming(Math.max(1, Math.min(scale.value, 3)));
    });

  const flingGesture = Gesture.Fling()
    .enabled(!enablePanGesture && !imageDetails)
    .direction(Directions.DOWN)
    .onEnd(() => onCloseView())
    .runOnJS(true);

  const singleTapGesture = Gesture.Tap()
    .numberOfTaps(1)
    .onStart(() => {
      setHideMenus((pre) => !pre);
    })
    .runOnJS(true);

  const doubleTapGesture = Gesture.Tap()
    .numberOfTaps(2)
    .onStart(() => {
      if (scale.value >= 2) {
        updateValue.value = withTiming({
          ...updateValue.value,
          t: IMAGE_MARGIN_FROM_TOP,
        });
        scale.value = withTiming(1);
        runOnJS(setEnablePanGesture)(false);
      } else {
        scale.value = withTiming(2);
        runOnJS(setEnablePanGesture)(true);
      }
    });

  const panGesture = Gesture.Pan()
    .enabled(enablePanGesture)
    .onBegin((e) => {
      updateInitialValue.value = { ...updateValue.value };
    })
    .onUpdate((e) => {
      updateValue.value = {
        h: IMAGE_HEIGHT,
        w: width,
        t: e.translationY + updateInitialValue.value.t,
        l: defalutLeftValue,
      };
    });

  const componseTapGestures = Gesture.Exclusive(doubleTapGesture, singleTapGesture);

  const composedGesture = Gesture.Race(componseTapGestures, panGesture, pinchGesture);

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
          [0, Math.min(updateValue.value.t, defalutTopValue)],
          [defalutTopValue, updateValue.value.t],
          Extrapolation.CLAMP
        ),
        { duration: isReady ? 0 : 300 }
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
      scale.value = 1;
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
    setIsReady(false);
    scale.value = 1;
    updateValue.value = {
      w: 0,
      h: 0,
      t: 0,
      l: 0,
    };

    setTimeout(
      () => {
        onClose();
      },
      scale.value > 1 ? duration : duration / 2
    );
  };

  const getAssetInfo = async () => {
    const details = await getAssetInfoAsync(selectedImage.id);

    setImageDetails(details);

    // Alert.alert(JSON.stringify(details));
    bottomSheetRef.current?.present();
  };

  if (selectedImage)
    return (
      <>
        <StatusBar style="inverted" />
        <GestureDetector gesture={flingGesture}>
          <BGContainer sharedValue={updateValue}>
            <GestureDetector gesture={composedGesture}>
              <Animated.View
                // entering={FadeIn.duration(10)}
                // exiting={FadeOut.duration(50)}
                style={[
                  {
                    position: 'absolute',
                    alignItems: 'center',
                    backgroundColor: 'black',
                    justifyContent: 'center',
                  },
                  smallToLargeStyle,
                ]}>
                <Image
                  transition={{ duration: 10, effect: 'curl-down', timing: 'linear' }}
                  source={selectedImage.uri}
                  style={{ width: '100%', height: '100%' }}
                  contentFit="contain"
                />
              </Animated.View>
            </GestureDetector>
          </BGContainer>
        </GestureDetector>
        {isReady && (
          <View style={StyleSheet.absoluteFillObject}>
            <TopBar visible={!hideMenus}>
              <TouchableIcon
                onPress={onCloseView}
                icon={<MaterialIcons name="arrow-back" size={24} color="white" />}
              />

              <Text style={{ color: 'white' }}>{selectedImage?.filename.split('.')[0]}</Text>
              <TouchableIcon
                onPress={onCloseView}
                icon={<MaterialCommunityIcons name="close" size={24} color="white" />}
              />
            </TopBar>

            <BottomBar visible={!hideMenus}>
              <TouchableIcon
                onPress={getAssetInfo}
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
          </View>
        )}
        <EnlargeViewSheet ref={bottomSheetRef} data={imageDetails as AssetInfo} />
      </>
    );
};
