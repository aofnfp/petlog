import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import React, { useEffect } from 'react';
import { StatusBar, Platform } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { ErrorBoundary } from '@/components/ErrorBoundary';

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  useEffect(() => {
    SplashScreen.hideAsync();
    if (Platform.OS !== 'web') {
      StatusBar.setBarStyle('dark-content');
    }
  }, []);

  return (
    <ErrorBoundary>
      <GestureHandlerRootView style={{ flex: 1 }}>
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen name="(tabs)" />
          <Stack.Screen name="onboarding" options={{ gestureEnabled: false }} />
          <Stack.Screen name="add-vaccination" options={{ presentation: 'card' }} />
          <Stack.Screen name="add-medication" options={{ presentation: 'card' }} />
          <Stack.Screen name="add-vet-visit" options={{ presentation: 'card' }} />
          <Stack.Screen name="add-weight" options={{ presentation: 'card' }} />
          <Stack.Screen name="privacy" options={{ presentation: 'card' }} />
        </Stack>
      </GestureHandlerRootView>
    </ErrorBoundary>
  );
}
