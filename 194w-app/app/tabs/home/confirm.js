import React, { useState, useEffect } from "react";
import { StyleSheet, View, ImageBackground, Text, Image } from "react-native";
import { useRouter } from "expo-router";
import Theme from "@/src/theme/theme";
import LoadingNoPainBlob from "@/src/animations/LoadingNoPainBlob";
import LoadingMildPainBlob from "@/src/animations/LoadingMildPainBlob";
import LoadingSeverePainBlob from "@/src/animations/LoadingSeverePainBlob";
import LoadingVerySeverePainBlob from "@/src/animations/LoadingVerySeverePainBlob";
import LoadingWorstPainBlob from "@/src/animations/LoadingWorstPainBlob";
import { usePainLevelStore } from "@/src/store/painlevelStore";

export default function Page() {
  const router = useRouter();
  const [showSuccess, setShowSuccess] = useState(false);
  const { painLevel } = usePainLevelStore();

  useEffect(() => {
    // Show loading for 1 second, then success for 1 second
    const loadingTimer = setTimeout(() => {
      setShowSuccess(true);
    }, 1000);

    const navigationTimer = setTimeout(() => {
      router.push("/tabs/home");
    }, 2000);

    return () => {
      clearTimeout(loadingTimer);
      clearTimeout(navigationTimer);
    };
  }, [router]);

  const PainBlob = () => {
    switch (painLevel) {
      case 0:
        return <LoadingNoPainBlob size={150} />;
      case 1:
      case 2:
        return <LoadingMildPainBlob size={150} />;
      case 3:
      case 4:
        return <LoadingSeverePainBlob size={150} />;
      case 5:
      case 6:
        return <LoadingVerySeverePainBlob size={150} />;
      case 7:
      case 8:
      case 9:
      case 10:
        return <LoadingWorstPainBlob size={150} />;
      default:
        return <LoadingNoPainBlob size={150} />;
    }
  };

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
  blobImage: {
    padding: Theme.spacing.lg,
    resizeMode: "contain",
  },
});
