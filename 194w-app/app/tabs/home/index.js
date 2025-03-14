import { StyleSheet, View, ImageBackground, Image, Text } from "react-native";
import { Link } from "expo-router";
import Theme from "@/src/theme/theme";
import Button from "@/src/components/ui/NextButton";
import { useRouter } from "expo-router";
import Blob from "@/src/components/ui/Blob";
import { Animated, Easing } from "react-native";
import React, { useEffect, useRef } from "react";

export default function Page() {
  const router = useRouter();

  const scaleAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    const bounce = Animated.loop(
      Animated.sequence([
        Animated.timing(scaleAnim, {
          toValue: 0.9, // Grow
          duration: 1000,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(scaleAnim, {
          toValue: 1, // Shrink back
          duration: 1000,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
      ])
    );

    bounce.start();

    return () => bounce.stop(); // Cleanup on unmount
  }, [scaleAnim]);

  return (
    <ImageBackground
      source={require("@/assets/background.png")}
      resizeMode="cover"
      style={styles.background}
    >
      <View style={styles.container}>
        <Text style={styles.heading}>Hi,{"\n"}how's your pain today?</Text>
        <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
          <Blob size={250} />
        </Animated.View>
        <View style={[styles.buttonContainer, { borderTopRightRadius: 0 }]}>
          <Button
            title="Log Entry"
            onPress={() => router.push("/tabs/home/painscale")}
          />
          <Button
            title="History"
            onPress={() => router.push("/tabs/home/history")}
          />
        </View>
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
  },
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  heading: {
    fontSize: Theme.typography.sizes.xl,
    color: Theme.colors.white,
    textAlign: "center",
    fontFamily: Theme.typography.fonts.bold,
  },
  blobImage: {
    width: 250,
    height: 250,
    resizeMode: "contain",
  },
  buttonContainer: {
    marginVertical: 10,
    flexDirection: "row",
    justifyContent: "space-evenly",
    width: "100%",
  },
});
