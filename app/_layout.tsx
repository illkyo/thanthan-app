import { SplashScreen, Stack } from "expo-router";
import "./globals.css";
import { useFonts } from "expo-font";
import { useEffect } from "react";
import GlobalProvider from "@/lib/global-provider";
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { StatusBar } from "expo-status-bar";
// import { StatusBar } from "react-native";

export default function RootLayout() {
  const [fontsLoaded, error] = useFonts({
      "Rubik-Bold": require('@/assets/fonts/Rubik-Bold.ttf'),
      "Rubik-ExtraBold": require('@/assets/fonts/Rubik-ExtraBold.ttf'),
      "Rubik-Light": require('@/assets/fonts/Rubik-Light.ttf'),
      "Rubik-Medium": require('@/assets/fonts/Rubik-Medium.ttf'),
      "Rubik-Regular": require('@/assets/fonts/Rubik-Regular.ttf'),
      "Rubik-SemiBold": require('@/assets/fonts/Rubik-SemiBold.ttf'),
    });

  useEffect(() => {
    if (fontsLoaded || error) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded, error]);

  if (!fontsLoaded && !error) return null;

  return (
    <GlobalProvider>
      <Stack screenOptions={{ headerShown: false, statusBarHidden: false, statusBarBackgroundColor: 'transparent', statusBarTranslucent: true }} />
      {/* <Stack screenOptions={{ headerShown: false }} /> */}
    </GlobalProvider>
  );
};
