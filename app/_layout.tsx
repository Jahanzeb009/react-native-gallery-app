import { Stack } from 'expo-router';

export const unstable_settings = {
  initialRouteName: 'home',
};

export default function RootLayout() {
  return (
    <Stack>
      <Stack.Screen name="index" options={{ title: 'Home' }} />
    </Stack>
  );
}
