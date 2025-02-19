import { Stack, Slot } from "expo-router";
import { PaperProvider } from 'react-native-paper';
import { paperTheme } from '@/src/theme/paperTheme';
import { useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { supabase } from "@/src/lib/api/supabase";

export default function RootLayout() {
  const [isLoading, setIsLoading] = useState(true);
  const [hasCompletedOnboarding, setHasCompletedOnboarding] = useState(false);
  const [session, setSession] = useState(null);

  useEffect(() => {
    const checkAppState = async () => {
      try {
        await AsyncStorage.clear(); // Uncomment this line temporarily to test first launch

        const [{ data: { session } }, hasOnboarded] = await Promise.all([
          supabase.auth.getSession(),
          AsyncStorage.getItem('hasCompletedOnboarding')
        ]);

        console.log('Onboarding status:', hasOnboarded); // Debug log
        setSession(session);
        setHasCompletedOnboarding(hasOnboarded === 'true');
      } catch (error) {
        console.error('Error checking app state:', error);
      } finally {
        setIsLoading(false);
      }
    };

    checkAppState();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription?.unsubscribe();
  }, []);

  if (isLoading) {
    return null;
  }

  return (
    <PaperProvider theme={paperTheme}>
      {session ? (
        // Logged in - show main app
        <Stack>
          <Stack.Screen 
            name="tabs" 
            options={{ 
              headerShown: false,
              gestureEnabled: false 
            }} 
          />
        </Stack>
      ) : (
        // Not logged in - show onboarding or auth
        <Stack screenOptions={{ headerShown: false }}>
          {!hasCompletedOnboarding ? (
            <Stack.Screen 
              name="onboarding" 
              options={{ gestureEnabled: false }} 
            />
          ) : (
            <Stack.Screen 
              name="index" 
              options={{ gestureEnabled: false }} 
            />
          )}
        </Stack>
      )}
    </PaperProvider>
  );
}