import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import React, { useEffect } from "react";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { StyleSheet, View, Text, TouchableOpacity } from "react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { AppStateProvider } from "@/hooks/useAppState";
import { SubscriptionProvider } from "@/hooks/useSubscription";
import AsyncStorage from '@react-native-async-storage/async-storage';

SplashScreen.preventAutoHideAsync();

const queryClient = new QueryClient();

class ErrorBoundary extends React.Component<
  { children: React.ReactNode },
  { hasError: boolean; error?: Error }
> {
  constructor(props: { children: React.ReactNode }) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error) {
    console.error('ErrorBoundary caught error:', error);
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('ErrorBoundary error details:', error, errorInfo);
  }

  handleClearData = async () => {
    try {
      console.log('Clearing all data due to error...');
      
      // Get all keys and clear any that might be corrupted
      const allKeys = await AsyncStorage.getAllKeys();
      const appKeys = allKeys.filter(key => 
        ['user', 'vehicles', 'documents', 'reminders', 'theme_mode'].includes(key)
      );
      
      console.log('Clearing keys:', appKeys);
      
      // Clear each key individually and log any errors
      for (const key of appKeys) {
        try {
          await AsyncStorage.removeItem(key);
          console.log(`Successfully cleared key: ${key}`);
        } catch (keyError) {
          console.error(`Error clearing key '${key}':`, keyError);
        }
      }
      
      // Also try to clear any other potentially corrupted keys
      try {
        const allStorageKeys = await AsyncStorage.getAllKeys();
        const suspiciousKeys = allStorageKeys.filter(key => {
          // Look for keys that might contain corrupted data
          return key.includes('object') || key.includes('undefined') || key.startsWith('o');
        });
        
        if (suspiciousKeys.length > 0) {
          console.log('Found suspicious keys to clear:', suspiciousKeys);
          await AsyncStorage.multiRemove(suspiciousKeys);
        }
      } catch (suspiciousError) {
        console.error('Error clearing suspicious keys:', suspiciousError);
      }
      
      this.setState({ hasError: false, error: undefined });
      console.log('Data cleared, reloading app...');
    } catch (clearError) {
      console.error('Error clearing data:', clearError);
      // Force reload anyway
      this.setState({ hasError: false, error: undefined });
    }
  };

  render() {
    if (this.state.hasError) {
      return (
        <SafeAreaProvider>
          <View style={errorStyles.container}>
            <View style={errorStyles.content}>
              <Text style={errorStyles.title}>Something went wrong</Text>
              <Text style={errorStyles.message}>
                The app encountered an error. This might be due to corrupted data.
              </Text>
              <TouchableOpacity style={errorStyles.button} onPress={this.handleClearData}>
                <Text style={errorStyles.buttonText}>Clear Data & Restart</Text>
              </TouchableOpacity>
            </View>
          </View>
        </SafeAreaProvider>
      );
    }

    return this.props.children;
  }
}

const errorStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  content: {
    backgroundColor: '#ffffff',
    padding: 24,
    borderRadius: 12,
    alignItems: 'center',
    maxWidth: 300,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 12,
  },
  message: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 24,
    lineHeight: 22,
  },
  button: {
    backgroundColor: '#07c3aa',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  buttonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
});

function RootLayoutNav() {
  return (
    <Stack screenOptions={{ headerBackTitle: "Back" }}>
      <Stack.Screen name="(auth)" options={{ headerShown: false }} />
      <Stack.Screen name="welcome" options={{ headerShown: false }} />
      <Stack.Screen name="onboarding" options={{ headerShown: false }} />
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      <Stack.Screen name="vehicle/[id]" options={{ title: "Vehicle Details" }} />
      <Stack.Screen name="add-vehicle" options={{ title: "Add Vehicle", presentation: "modal" }} />
      <Stack.Screen name="add-document" options={{ title: "Add Document", presentation: "modal" }} />
      <Stack.Screen name="add-reminder" options={{ title: "Add Reminder", presentation: "modal" }} />
      <Stack.Screen name="edit-vehicle" options={{ title: "Edit Vehicle", presentation: "modal" }} />
      <Stack.Screen name="renewal" options={{ title: "Renewal Service", presentation: "modal" }} />
    </Stack>
  );
}

export default function RootLayout() {
  useEffect(() => {
    SplashScreen.hideAsync();
  }, []);

  return (
    <ErrorBoundary>
      <SafeAreaProvider>
        <QueryClientProvider client={queryClient}>
          <AppStateProvider>
            <SubscriptionProvider>
              <GestureHandlerRootView style={styles.container}>
                <RootLayoutNav />
              </GestureHandlerRootView>
            </SubscriptionProvider>
          </AppStateProvider>
        </QueryClientProvider>
      </SafeAreaProvider>
    </ErrorBoundary>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});