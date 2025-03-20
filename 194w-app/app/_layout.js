import { Stack } from "expo-router";
import { useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { supabase } from "@/src/lib/api/supabase";
import { updateUserProfile } from "@/src/lib/api/utils";
export default function RootLayout() {
  const [isLoading, setIsLoading] = useState(true);
  const [hasCompletedOnboarding, setHasCompletedOnboarding] = useState(false);
  const [session, setSession] = useState(null);

  useEffect(() => {
    const initialize = async () => {
      try {
        const {
          data: { session: initialSession },
        } = await supabase.auth.getSession();
        setSession(initialSession);

        // ! TESTING ONLY
        // await AsyncStorage.clear();
        const hasOnboarded = await AsyncStorage.getItem(
          "hasCompletedOnboarding"
        );
        setHasCompletedOnboarding(hasOnboarded === "true");
        if (hasOnboarded === "true" && initialSession?.user) {
          const painType = await AsyncStorage.getItem("painType");
          const painDuration = await AsyncStorage.getItem("painDuration");
          if (painType && painDuration) {
            await updateUserProfile(initialSession.user.id, {
              pain_type: painType,
              pain_duration: painDuration,
            });
            await AsyncStorage.multiRemove(["painType", "painDuration"]);
          }
        }
      } catch (error) {
        console.error("Error during initialization:", error);
      } finally {
        setIsLoading(false);
      }
    };

    initialize();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => {
      subscription?.unsubscribe();
    };
    return () => {
      subscription?.unsubscribe();
    };
  }, []);

  if (isLoading) {
    return null;
  }

  return (
    <Stack screenOptions={{ headerShown: false }}>
      {session ? (
        <Stack.Screen
          name="tabs"
          options={{
            headerShown: false,
            gestureEnabled: false,
          }}
        />
      ) : !hasCompletedOnboarding ? (
        <Stack.Screen
          name="onboarding"
          options={{
            headerShown: false,
            gestureEnabled: false,
          }}
        />
      ) : (
        <Stack.Screen
          name="index"
          options={{
            headerShown: false,
            gestureEnabled: false,
          }}
        />
      )}
    </Stack>
  );
}
