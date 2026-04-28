import { useEffect } from 'react';
import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Stack, useRouter, useSegments } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { View, ActivityIndicator } from 'react-native'; // Added for loading state
import 'react-native-reanimated';
import { AuthProvider, useAuth } from '@/context/AuthContext';
import { useColorScheme } from '@/hooks/use-color-scheme';

function RootLayoutNav() {
  const { userToken, isLoading } = useAuth();
  const segments = useSegments();
  const router = useRouter();
  const colorScheme = useColorScheme();

  useEffect(() => {
    if (isLoading) return;

    // Normalize the segment for the root/index path
    const currentSegment = segments[0] === undefined || segments[0] === '' ? 'index' : segments[0];
    
    // Pages that do NOT require a login
    const isPublicPage = currentSegment === 'loginpage' || 
                         currentSegment === 'signinpage' || 
                         currentSegment === 'index';

    if (!userToken && !isPublicPage) {
      // 1. Kick unauthenticated users out of protected areas
      router.replace('/loginpage');
    } else if (userToken && isPublicPage) {
      // 2. Prevent authenticated users from seeing landing/login/signup
      router.replace('/home');
    }
  }, [userToken, segments, isLoading]);

  // --- UX ENHANCEMENT: PREVENT FLICKER ---
  
  // 1. If still checking local storage, show nothing or a splash/loading indicator
  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#FFFFFF' }}>
        <ActivityIndicator size="large" color="#4F46E5" />
      </View>
    );
  }

  // 2. Identify if we are in a "State Mismatch" (e.g., Logged in but URL says loginpage)
  const currentSegment = segments[0] === undefined || segments[0] === '' ? 'index' : segments[0];
  const isPublicPage = currentSegment === 'loginpage' || currentSegment === 'signinpage' || currentSegment === 'index';
  
  // If a mismatch is detected, return null. 
  // This is the "Magic" that stops the login screen from flickering before the redirect.
  if ((userToken && isPublicPage) || (!userToken && !isPublicPage)) {
    return <View style={{ flex: 1, backgroundColor: '#FFFFFF' }} />;
  }

  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <Stack screenOptions={{ headerShown: false }}>
        {/* Landing & Auth */}
        <Stack.Screen name="index" />
        <Stack.Screen name="loginpage" />
        <Stack.Screen name="signinpage" />
        
        {/* Protected Pages */}
        <Stack.Screen name="home" />
        <Stack.Screen name="wallet" options={{ headerShown: false }} />
        <Stack.Screen name="(tabs)" />
        <Stack.Screen name="modal" options={{ 
            presentation: 'modal', 
            title: 'Secure Vault', 
            headerShown: true 
          }} 
        />
      </Stack>
      <StatusBar style="auto" />
    </ThemeProvider>
  );
}

export default function RootLayout() {
  return (
    <AuthProvider>
      <RootLayoutNav />
    </AuthProvider>
  );
}