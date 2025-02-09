import "react-native-url-polyfill/auto";
import { useState, useEffect } from "react";
import { supabase } from "../src/lib/api/supabase";
import Auth from "./components/Auth";
import { View, Text, ImageBackground, StyleSheet } from "react-native";
import { Session } from "@supabase/supabase-js";
import { useFonts } from "expo-font";
import { Redirect } from "expo-router";

export default function App() {
  const [session, setSession] = useState(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });

    supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });
  }, []);

  if (session) {
    return <Redirect href="/tabs/home" />;
  } else {
    return (
      <ImageBackground
        source={require("@/assets/background.png")} // Local image
        resizeMode="cover"
        style={styles.background}
      >
        <View>
          <Auth />
          {session && session.user && <Text>{session.user.id}</Text>}
        </View>
      </ImageBackground>
    );
  }
}
const styles = StyleSheet.create({
  background: {
    flex: 1, // Ensures full-screen background
    justifyContent: "center",
    alignItems: "center",
  },
});
