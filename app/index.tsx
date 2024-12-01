import {
  View,
  Text,
  ActivityIndicator,
  FlatList,
  Button,
  TouchableOpacity,
  Pressable,
  GestureResponderEvent,
  ColorValue,
  useWindowDimensions,
} from 'react-native';
import React, { useEffect, useState } from 'react';
import * as MediaLibrary from 'expo-media-library';
import { Image } from 'expo-image';
import { EnlargeView } from '~/src/components/EnlargeView';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Link, router } from 'expo-router';
const Home = () => {
  const [localAssets, setLocalAssets] = useState<MediaLibrary.Asset[] | null>(null);
  const [localAssetsInfo, setLocalAssetsInfo] = useState<{
    hasNextPage: boolean;
    nextPageId: string;
    totalCount: number;
  }>();
  const [permissionResponse, requestPermission] = MediaLibrary.usePermissions();
  const [selectedImage, setSelectedImage] = useState<
    (GestureResponderEvent['nativeEvent'] & MediaLibrary.Asset) | null
  >(null);
  const [isAppReady, setIsAppReady] = useState(false);

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
    layout: { x: number; y: number; width: number; height: number },
    item: MediaLibrary.Asset
  ) => {
    // Pass shared values via navigation params
    router.navigate({
      pathname: '/imageViewer',
      params: {
        index,
        ...item,
        x: layout.x,
        y: layout.y,
        width: layout.width,
        height: layout.height,
      },
    });
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      {/* <Link href={'/(test)'}>Test</Link> */}

      <FlatList
        data={localAssets}
        numColumns={4}
        // columnWrapperStyle={{ gap: 5 }}
        // contentContainerStyle={{ gap: 5 }}
        onEndReached={getAlbums}
        onEndReachedThreshold={1}
        renderItem={({ item, index }) => {
          return (
            <Pressable
              key={index}
              style={{
                width: IMAGE_SIZE,
                aspectRatio: 1,
                alignItems: 'center',
                justifyContent: 'center',
              }}
              onPress={async (e) => {
                e.target.measure((x, y, width, height, pageX, pageY) => {
                  onPress(index, { x: pageX, y: pageY, width, height }, item);
                });

                // setSelectedImage({
                //   ...e.nativeEvent,
                //   ...item,
                // });
              }}>
              <Image source={item.uri} style={{ width: '98%', height: '98%' }} contentFit="cover" />
            </Pressable>
          );
        }}
      />

      <Text style={{ textAlign: 'center' }}>Total Image: {localAssetsInfo?.totalCount}</Text>

      {/* {selectedImage && (
        <EnlargeView
          imageSize={IMAGE_SIZE}
          onClose={() => {
            setSelectedImage(null);
          }}
          selectedImage={selectedImage}
        />
      )} */}
    </SafeAreaView>
  );
};

export default Home;
