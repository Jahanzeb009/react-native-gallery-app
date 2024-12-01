import { router } from 'expo-router';
import React from 'react';
import { View, Text, TouchableOpacity, useWindowDimensions, ScrollView } from 'react-native';
import Animated, { useSharedValue, useAnimatedStyle, withTiming } from 'react-native-reanimated';

const Homee = () => {
  const { width } = useWindowDimensions();

  // Shared values for position, size
  // const sharedX = useSharedValue(0);
  // const sharedY = useSharedValue(0);
  // const sharedWidth = useSharedValue(width * 0.3);
  // const sharedHeight = useSharedValue(width * 0.3);

  const onPress = (index, layout) => {
    // Pass shared values via navigation params
    router.navigate({
      pathname: '/(test)/second',
      params: {
        index,
        layout: {
          x: layout.x,
          y: layout.y,
          width: layout.width,
          height: layout.height,
        },
      },
    });
  };

  return (
    <ScrollView>
      <View
        style={{
          // flex: 1,
          justifyContent: 'center',
          flexDirection: 'row',
          gap: 10,
          flexWrap: 'wrap',
        }}>
        {Array.from({ length: 100 }).map((_, index) => (
          <TouchableOpacity
            key={index}
            onPress={(e) => {
              e.target.measure((x, y, width, height, pageX, pageY) => {
                onPress(index, { x: pageX, y: pageY, width, height });
              });
            }}>
            <Animated.Image
              source={{
                uri: 'https://plus.unsplash.com/premium_photo-1664474619075-644dd191935f?q=80&w=2069&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
              }}
              style={{
                marginBottom: 10,
                width: width * 0.3,
                height: width * 0.3,
                backgroundColor: 'blue',
              }}
            />
          </TouchableOpacity>
        ))}
      </View>
    </ScrollView>
  );
};

export default Homee;
