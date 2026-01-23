import { Stack } from "expo-router";
import { AppStateProvider } from "./state-controller/state-controller";

export default function RootLayout() {
  return (
    <AppStateProvider>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="index" />
      </Stack>
    </AppStateProvider>
  );
}
