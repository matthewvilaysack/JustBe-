import React, { useState, useEffect } from "react";
import { StyleSheet, View, ImageBackground, Text } from "react-native";
import { useRouter } from "expo-router";
import Theme from "@/src/theme/theme";

export default function Page() {
  const router = useRouter();
  useEffect(() => {
    const timer = setTimeout(() => {
      router.push("/tabs/home");
    }, 2000);

    return () => clearTimeout(timer); // Cleanup in case component unmounts
  }, [router]);

  return (
    <ImageBackground
      source={require("@/assets/background.png")}
      resizeMode="cover"
      style={styles.background}
    >
      <View style={styles.container}>
        <Text style={styles.heading}>Your symptoms have been logged!</Text>
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
  heading: {
    fontSize: Theme.typography.sizes.xl,
    color: Theme.colors.white,
    textAlign: "center",
    marginBottom: Theme.spacing.xl,
    fontFamily: Theme.typography.fonts.bold,
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
    bottom: Theme.spacing.xxl,
    alignItems: "center",
    gap: Theme.spacing.xl,
  },
  footer: {
    flexDirection: "row",
    justifyContent: "flex-end",
    paddingBottom: Theme.spacing.lg,
    paddingRight: Theme.spacing.lg,
  },
});
