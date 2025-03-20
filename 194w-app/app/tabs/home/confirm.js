import React, { useState, useEffect } from "react";
import { StyleSheet, View, ImageBackground, Text, Image } from "react-native";
import { useRouter } from "expo-router";
import Theme from "@/src/theme/theme";

export default function Page() {
  const router = useRouter();
  useEffect(() => {
    const navigationTimer = setTimeout(() => {
      router.push("/tabs/home");
    }, 2000);

    return () => {
      clearTimeout(navigationTimer);
    };
  }, [router]);

  return (
    <ImageBackground
      source={require("@/assets/background.png")}
      resizeMode="cover"
      style={styles.background}
    >
      <View style={styles.container}>
        <Text style={styles.heading}>Your entry have been logged!</Text>
        <Image
          source={require("@/assets/blob-wink.png")}
          style={styles.blobImage}
        />
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
    padding: Theme.spacing.xl,
  },
  contentContainer: {
    alignItems: "center",
    justifyContent: "center",
  },
  heading: {
    fontSize: Theme.typography.sizes.xl,
    color: Theme.colors.white,
    textAlign: "center",
    fontFamily: Theme.typography.fonts.bold,
    textShadowColor: "rgba(0, 0, 0, 0.3)",
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  dateText: {
    fontSize: Theme.typography.sizes.md,
    fontWeight: "bold",
    marginBottom: 5,
    color: Theme.colors.darkGray,
  },
  journalContainer: {
    backgroundColor: "white",
    minHeight: "40%",
    minWidth: "100%",
    borderRadius: Theme.radius.lg,
    borderWidth: 1,
    borderColor: "gray",
    padding: 10,
  },
  textArea: {
    fontSize: Theme.typography.sizes.xl,
    fontFamily: Theme.typography.fonts.bold,
  },
  buttonContainer: {
    position: "absolute",
    textShadowColor: "rgba(0, 0, 0, 0.3)",
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  footer: {
    flexDirection: "row",
    justifyContent: "flex-end",
    paddingBottom: Theme.spacing.lg,
    paddingRight: Theme.spacing.lg,
  },
  blobImage: {
    padding: Theme.spacing.lg,
    resizeMode: "contain",
  },
});
