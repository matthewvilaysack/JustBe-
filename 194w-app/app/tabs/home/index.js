import { StyleSheet, View, ImageBackground, Image, Text } from "react-native";

import FontAwesome from "@expo/vector-icons/FontAwesome";
import { Link } from "expo-router";

import Theme from "@/assets/theme";

export default function Page() {
  return (
    <ImageBackground
      source={require("@/assets/background.png")}
      resizeMode="cover"
      style={styles.background}
    >
      <Text>Hi, how's your pain today?</Text>
      <Image source={require("@/assets/blob-smile.png")}></Image>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1, // Ensures full-screen background
    justifyContent: "center",
    alignItems: "center",
  },
});
