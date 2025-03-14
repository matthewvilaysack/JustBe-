import { useEffect, useState } from "react";
import { Redirect } from "expo-router";
import { supabase } from "@/src/lib/api/supabase";
import { useFonts } from "expo-font";
import Auth from "./components/Auth";
import { View, ActivityIndicator, ImageBackground, LogBox } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

LogBox.ignoreAllLogs();

export default function Index() {
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);
  const [firstVisit, setFirstVisit] = useState(true);
  const [fontsLoaded] = useFonts({
    LexendDecaBold: require("@/assets/fonts/LexendDeca-Bold.ttf"),
    LexendDecaRegular: require("@/assets/fonts/LexendDeca-Regular.ttf"),
  });

  useEffect(() => {
    const initialize = async () => {
      try {
        const [
          {
            data: { session },
          },
          hasCompletedOnboarding,
        ] = await Promise.all([
          supabase.auth.getSession(),
          AsyncStorage.getItem("hasCompletedOnboarding"),
        ]);

        setSession(session);
        setFirstVisit(hasCompletedOnboarding !== "true");
        setLoading(false);
      } catch (error) {
        console.error("Error during initialization:", error);
        setLoading(false);
      }
    };

    initialize();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription?.unsubscribe();
  }, []);

  if (loading) {
    return (
      <ImageBackground
        source={require("@/assets/background.png")}
        resizeMode="cover"
        style={{ flex: 1 }}
      >
        <View
          style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
        >
          <ActivityIndicator size="large" />
        </View>
      </ImageBackground>
    );
  }

  // if logged in, go to main app
  if (session) {
    return <Redirect href="/tabs/home" />;
  }

  // if yes, go to onboarding
  if (firstVisit) {
    return <Redirect href="/onboarding" />;
  }

  // if not first visit and not logged in, show auth
  return (
    <ImageBackground
      source={require("@/assets/background.png")}
      resizeMode="cover"
      style={{ flex: 1 }}
    >
      <Auth />
    </ImageBackground>
  );
}
