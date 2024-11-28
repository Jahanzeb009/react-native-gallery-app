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
const Home = () => {
  const [albums, setAlbums] = useState<MediaLibrary.Asset[] | null>(null);
  const [permissionResponse, requestPermission] = MediaLibrary.usePermissions();
  const [selectedImage, setSelectedImage] = useState<
    (GestureResponderEvent['nativeEvent'] & { color: ColorValue; uri: string }) | null
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
    // const albums = await MediaLibrary.getAlbumsAsync({
    //   includeSmartAlbums: true,
    // });
    const assets = await MediaLibrary.getAssetsAsync();
    setAlbums(assets.assets);
    // console.log(assets.totalCount);
  };

  if (!isAppReady) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size={'large'} />
      </View>
    );
  }

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <Button title="getAlbums" onPress={getAlbums} />
      <FlatList
        data={albums}
        numColumns={4}
        // columnWrapperStyle={{ gap: 5 }}
        // contentContainerStyle={{ gap: 5 }}
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
              onPress={(e) => {
                setSelectedImage({
                  ...e.nativeEvent,
                  color: '#000',
                  uri: item.uri,
                });
              }}>
              <Image source={item.uri} style={{ width: '98%', height: '98%' }} contentFit="cover" />
            </Pressable>
          );
        }}
      />
      {selectedImage && (
        <EnlargeView
          imageSize={IMAGE_SIZE}
          onClose={() => {
            setSelectedImage(null);
          }}
          selectedImage={selectedImage}
          setSelectedImage={setSelectedImage}
        />
      )}
    </SafeAreaView>
  );
};

export default Home;
