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
      </Stack>
    </GestureHandlerRootView>
  );
}
