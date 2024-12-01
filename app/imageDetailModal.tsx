import { View, Text, Button, ActivityIndicator } from 'react-native';
import React, { Children, useEffect, useState } from 'react';
import MapView, { Marker } from 'react-native-maps';
import { Stack, useGlobalSearchParams } from 'expo-router';
import { AssetInfo, getAssetInfoAsync } from 'expo-media-library';

const ImageDetailModal = () => {
  // @ts-ignore
  const { id } = useGlobalSearchParams<{ id: string }>();

  const [data, setdata] = useState<AssetInfo>();
  const [isReady, setIsReady] = useState(false);

  const getData = async () => {
    const details = await getAssetInfoAsync(id);
    setdata(details);
    setTimeout(() => {
      setIsReady(true);
    }, 800);
  };

  useEffect(() => {
    getData();
  }, []);

  const getDate = () => {
    if (data) {
      const date = new Date(data.creationTime);
      return date.toLocaleString('en-US', { dateStyle: 'full', timeStyle: 'medium' });
    }
  };

  const Container = ({ children }: { children: React.ReactNode }) => {
    return (
      <View
        style={{
          width: 'auto',
          paddingVertical: 3,
          paddingHorizontal: 15,
          alignSelf: 'flex-start',
          backgroundColor: '#eee',
          borderRadius: 10,
        }}>
        {children}
      </View>
    );
  };

  if (!isReady) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator />
      </View>
    );
  }

  return (
    <View style={{ flex: 1, gap: 30, padding: 10, backgroundColor: 'white' }}>
      <Stack.Screen options={{ title: data?.filename }} />

      <Container>
        <Text style={{ fontWeight: '600' }}>{getDate()}</Text>
      </Container>

      <View style={{ flexDirection: 'row', gap: 10, justifyContent: 'space-around' }}>
        <Container>
          <Text style={{ textTransform: 'capitalize' }}>{data?.mediaType}</Text>
        </Container>
        <Container>
          {data?.exif && (
            <Text style={{}}>Model : {data.exif['{TIFF}']?.Model || data.exif?.Model}</Text>
          )}
        </Container>
        <Container>
          <Text>
            {data?.width} x {data?.height}
          </Text>
        </Container>
      </View>

      <Container>
        <Text style={{}}>/Internal storage{data?.uri.split('0')[1]}</Text>
      </Container>

      {data?.location && (
        <MapView
          pointerEvents="none"
          region={{
            latitude: data.location.latitude,
            longitude: data.location.longitude,
            latitudeDelta: 0.1,
            longitudeDelta: 0.6,
          }}
          style={{
            width: '100%',
            height: 180,
            alignSelf: 'center',
            borderRadius: 15,
            overflow: 'hidden',
          }}>
          <Marker coordinate={data?.location} />
        </MapView>
      )}
    </View>
  );
};

export default ImageDetailModal;
