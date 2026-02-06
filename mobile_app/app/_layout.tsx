import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import "react-native-reanimated";
import { ReportProvider } from "../context/ReportContext";

import { useColorScheme } from "@/hooks/use-color-scheme";

// export const unstable_settings = {
//   anchor: "(tabs)",
// };

export default function RootLayout() {
  const colorScheme = useColorScheme();

  return (
    <ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
      <ReportProvider>
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen name="index" />
          <Stack.Screen name="onboarding" />
          <Stack.Screen name="loginAdmin" />
          <Stack.Screen name="adminDashboard" />
          <Stack.Screen name="(tabs)" />
          <Stack.Screen name="emergencyReport" />
        </Stack>
      </ReportProvider>
      <StatusBar style="auto" />
    </ThemeProvider>
  );
}
