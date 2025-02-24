import { Stack } from "expo-router";
import { useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { supabase } from "@/src/lib/api/supabase";
import { updateUserProfile } from "@/src/lib/api/utils";

export default function RootLayout() {
  const [isLoading, setIsLoading] = useState(true);
  const [hasCompletedOnboarding, setHasCompletedOnboarding] = useState(false);
  const [session, setSession] = useState(null);

  useEffect(() => {
    const checkAppState = async () => {
      try {
        // ! TESTING ONLY
        await AsyncStorage.clear();
        const { data: { session } } = await supabase.auth.getSession();
        const hasOnboarded = await AsyncStorage.getItem('hasCompletedOnboarding');
        setSession(session);
        setHasCompletedOnboarding(hasOnboarded === 'true');
        // Update profile if needed
        if (hasOnboarded === 'true' && session?.user) {
          const painType = await AsyncStorage.getItem("painType");
          const painDuration = await AsyncStorage.getItem("painDuration");
          if (painType && painDuration) {
            await updateUserProfile(session.user.id, {
              pain_type: painType,
              pain_duration: painDuration
            });
            await AsyncStorage.clear();
          }
        }
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
    <>
      {session ? (
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
    </>
  );
}