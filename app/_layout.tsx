import { Stack } from 'expo-router';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

export const unstable_settings = {
  initialRouteName: 'home',
};

export default function RootLayout() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <Stack>
        <Stack.Screen name="index" options={{ title: 'Home', headerShown: false }} />
        <Stack.Screen
          name="imageViewer"
          options={{
            title: 'Image Details',
            headerShown: false,
            animation: 'fade',
            presentation: 'transparentModal',
          }}
        />
        <Stack.Screen
          name="imageDetailModal"
          options={{
            title: 'Image Details Modal',
            // headerShown: false,
            animation: 'fade_from_bottom',
            presentation: 'containedModal',
          }}
        />

        {/* <Stack.Screen name="(test)" options={{ headerShown: false , presentation:'transparentModal', }} /> */}
      </Stack>
    </GestureHandlerRootView>
  );
}
