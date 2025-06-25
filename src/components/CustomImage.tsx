import { Platform, DimensionValue, ImageResizeMode, Image as RNImage } from 'react-native';
import React from 'react';
import { Image as ExpoImage, ImageContentFit, ImageStyle } from 'expo-image';

const CustomImage = ({
  uri,
  width,
  style,
  height,
  resizeMode,
}: {
  uri: string;
  style?: ImageStyle;
  width: DimensionValue;
  height: DimensionValue;
  resizeMode: ImageContentFit & ImageResizeMode;
}) => {
  if (Platform.OS === 'ios')
    return <ExpoImage source={uri} contentFit={resizeMode} style={[{ width, height }, style]} />;
  else return <RNImage source={{ uri }} style={[{ resizeMode, width, height }, style]} />;
};

export default CustomImage;
