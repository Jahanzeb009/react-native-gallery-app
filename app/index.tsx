import {
  View,
  Text,
  FlatList,
  Pressable,
  ActivityIndicator,
  useWindowDimensions,
  GestureResponderEvent,
} from 'react-native';
import React, { useEffect, useState } from 'react';
import * as MediaLibrary from 'expo-media-library';
import { Image as ExpoImage } from 'expo-image';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router, useGlobalSearchParams } from 'expo-router';
import Animated, { FadeIn } from 'react-native-reanimated';
import CustomImage from '~/src/components/CustomImage';

const Home = () => {
  const [localAssets, setLocalAssets] = useState<MediaLibrary.Asset[] | null>(null);
  const [localAssetsInfo, setLocalAssetsInfo] = useState<{
    hasNextPage: boolean;
    nextPageId: string;
    totalCount: number;
  }>();
  const [permissionResponse, requestPermission] = MediaLibrary.usePermissions();
  const [isAppReady, setIsAppReady] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);

  const { reset } = useGlobalSearchParams();

  const resetIndex = () => {
    setSelectedIndex(null);
  };

  useEffect(() => {
    if (reset === 'true') {
      resetIndex();
    }
  }, [reset]);

  const { width, height } = useWindowDimensions();

  const IMAGE_SIZE = width * 0.25;

  useEffect(() => {
    if (permissionResponse?.status === 'granted') {
      setIsAppReady(true);
      getAlbums();
    } else {
      requestPermission();
    }
  }, [permissionResponse?.status]);

  const getAlbums = async () => {
    const res = await MediaLibrary.getAssetsAsync({
      after: localAssetsInfo?.nextPageId,
      first: 40,
    });
    if (res) {
      setLocalAssets(
        [...(localAssets ?? []), ...res.assets].sort((a, b) => b.creationTime - a.creationTime)
      );
      setLocalAssetsInfo({
        hasNextPage: res.hasNextPage,
        nextPageId: res.endCursor,
        totalCount: res.totalCount,
      });
    }
  };

  if (!isAppReady) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size={'large'} />
      </View>
    );
  }

  const onPress = (
    index: number,
    layout: { x: number; y: number; imgInitialWidth: number; imgInitialHeight: number },
    item: MediaLibrary.Asset
  ) => {
    setSelectedIndex(index);
    router.navigate({
      pathname: '/imageViewer',
      params: {
        index,
        ...item,
        x: layout.x,
        y: layout.y,
        imgInitialWidth: layout.imgInitialWidth,
        imgInitialHeight: layout.imgInitialHeight,
      },
    });
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <FlatList
        numColumns={4}
        data={localAssets}
        onEndReached={getAlbums}
        onEndReachedThreshold={1}
        renderItem={({ item, index }) => {
          return (
            <RenderImage
              imageSize={IMAGE_SIZE}
              index={index}
              item={item}
              selectedIndex={selectedIndex}
              onPress={(e) => {
                e.target.measure((x, y, width, height, pageX, pageY) => {
                  onPress(
                    index,
                    { x: pageX, y: pageY, imgInitialWidth: width, imgInitialHeight: height },
                    item
                  );
                });
              }}
            />
          );
        }}
      />

      <Text style={{ textAlign: 'center' }}>Total Image: {localAssetsInfo?.totalCount}</Text>
    </SafeAreaView>
  );
};

export default Home;

const RenderImage = ({
  item,
  index,
  onPress,
  imageSize,
  selectedIndex,
}: {
  index: number;
  imageSize: number;
  item: MediaLibrary.Asset;
  selectedIndex: number | null;
  onPress: (e: GestureResponderEvent) => void;
}) => {
  return (
    <Animated.View
      key={index}
      entering={FadeIn}
      style={{
        aspectRatio: 1,
        width: imageSize,
        alignItems: 'center',
        justifyContent: 'center',
        opacity: selectedIndex === index ? 0 : 1,
      }}>
      <Pressable style={{ width: '100%', height: '100%' }} onPress={onPress}>
        <CustomImage uri={item.uri} resizeMode="cover" width={'98%'} height={'98%'} />
      </Pressable>
    </Animated.View>
  );
};
