import {
  View,
  Text,
  ActivityIndicator,
  FlatList,
  Button,
  TouchableOpacity,
  Pressable,
} from 'react-native';
import React, { useEffect, useState } from 'react';
import * as MediaLibrary from 'expo-media-library';
import { Image } from 'expo-image';
const Home = () => {
  const [albums, setAlbums] = useState<MediaLibrary.Asset[] | null>(null);
  const [permissionResponse, requestPermission] = MediaLibrary.usePermissions();

  const [isAppReady, setIsAppReady] = useState(false);
  // console.log(albums && albums[0]);
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
    <View style={{ flex: 1 }}>
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
                width: '25%',
                aspectRatio: 1,
                alignItems: 'center',
                justifyContent: 'center',
              }}
              onPress={(e)=>{
console.log(e.nativeEvent)
              }}
              >
              <Image
                source={item.uri}
                style={{ width: '98%', height: '98%', resizeMode: 'cover' }}
              />
            </Pressable>
          );
        }}
      />
    </View>
  );
};

export default Home;
