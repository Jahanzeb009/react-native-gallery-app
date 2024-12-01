import { View, Text, Button } from 'react-native';
import React, { forwardRef, useCallback, useRef } from 'react';
import BottomSheet, {
  BottomSheetModal,
  BottomSheetModalProvider,
  BottomSheetView,
  BottomSheetFooterContainer,
} from '@gorhom/bottom-sheet';
import { AssetInfo } from 'expo-media-library';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import MapView, { Marker } from 'react-native-maps';

type bottomSheetProps = {
  data: AssetInfo | null;
};

const EnlargeViewSheet = forwardRef<BottomSheetModal, bottomSheetProps>(({ data }, ref) => {
  const inset = useSafeAreaInsets();

  const handleSheetChanges = useCallback((index: number) => {
    console.log('handleSheetChanges', index);
  }, []);

  const getDate = () => {
    if (data) {
      const date = new Date(data.creationTime);
      return date.toLocaleString('en-US', { dateStyle: 'full', timeStyle: 'medium' });
    }
  };

  return (
    <BottomSheetModalProvider>
      <BottomSheetModal
        ref={ref}
        // onChange={handleSheetChanges}
        containerStyle={{ backgroundColor: '#00000099' }}
        // style={{ backgroundColor: 'green' }}
        enableDynamicSizing={false}
        // backgroundStyle={{ backgroundColor: 'yellow', marginBottom:100}}
        // handleStyle={{backgroundColor:'lime',marginBottom:100 }}
        snapPoints={['40', '80']}>
        <BottomSheetView style={{ flex: 1, padding: 10 }}>
          <Text style={{ fontWeight: 'bold' }}>{data?.filename}</Text>
          <Text style={{}}>{getDate()}</Text>
          {data?.exif && <Text style={{}}>model {data.exif['{TIFF}']?.Model}</Text>}

          <MapView
            region={{
              latitude: data?.location?.latitude,
              longitude: data?.location?.longitude,
            }}
            style={{ width: '90%', height: 150, alignSelf: 'center', borderRadius: 15 }}>
            <Marker coordinate={data?.location} />
          </MapView>
          <Button
            title="getDate"
            onPress={() => {
              // console.log(JSON.stringify(data,null,2))
              //   console.log(data?.exif['{TIFF}'].Model);
            }}
          />
        </BottomSheetView>
      </BottomSheetModal>
    </BottomSheetModalProvider>
  );
});

export default EnlargeViewSheet;
