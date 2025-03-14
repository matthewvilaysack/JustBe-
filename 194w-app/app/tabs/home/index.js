import { StyleSheet, View, ImageBackground, Text, ActivityIndicator, Animated, Easing } from "react-native";
import { useRouter } from "expo-router";
import { useEffect, useState, useRef } from "react";
import Theme from "@/src/theme/theme";
import Button from "@/src/components/ui/NextButton";
import useJournalStore from "@/src/store/journalStore";
import LoadingNoPainBlob from "@/src/animations/LoadingNoPainBlob";
import LoadingMildPainBlob from "@/src/animations/LoadingMildPainBlob";
import LoadingSeverePainBlob from "@/src/animations/LoadingSeverePainBlob";
import LoadingVerySeverePainBlob from "@/src/animations/LoadingVerySeverePainBlob";
import LoadingWorstPainBlob from "@/src/animations/LoadingWorstPainBlob";

export default function Page() {
  const router = useRouter();
  const [painRating, setPainRating] = useState(0);
  const { getJournalLogs, isLoading, journalLogs } = useJournalStore();
  const scaleAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    const loadData = async () => {
      await getJournalLogs();
    };

    loadData();
  }, []); // Initial load

  useEffect(() => {
    const today = new Date().toISOString().split('T')[0];
    const todayLogs = journalLogs[today] || [];
    // Get the first log since it's already the latest
    const latestLog = todayLogs[0];
    setPainRating(latestLog?.pain_rating ?? 0);
  }, [journalLogs]); 

  useEffect(() => {
    const bounce = Animated.loop(
      Animated.sequence([
        Animated.timing(scaleAnim, {
          toValue: 0.9,
          duration: 1000,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(scaleAnim, {
          toValue: 1,
          duration: 1000,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
      ])
    );

    bounce.start();

    return () => bounce.stop();
  }, [scaleAnim]);

  const PainBlob = () => {
    if (isLoading) {
      return (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={Theme.colors.white} />
        </View>
      );
    }

    const BlobComponent = (() => {
      switch (painRating) {
        case 0:
          return LoadingNoPainBlob;
        case 1:
        case 2:
          return LoadingMildPainBlob;
        case 3:
        case 4:
          return LoadingSeverePainBlob;
        case 5:
        case 6:
          return LoadingVerySeverePainBlob;
        case 7:
        case 8:
        case 9:
        case 10:
          return LoadingWorstPainBlob;
        default:
          return LoadingNoPainBlob;
      }
    })();

    return (
      <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
        <BlobComponent size={150} />
      </Animated.View>
    );
  };

  return (
    <ImageBackground
      source={require("@/assets/background.png")}
      resizeMode="cover"
      style={styles.background}
    >
      <View style={styles.container}>
        <Text style={styles.heading}>Hi,{"\n"}how's your pain today?</Text>
        <PainBlob />
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
    marginBottom: 20,
  },
  blobImage: {
    width: 250,
    height: 250,
    resizeMode: "contain",
  },
  buttonContainer: {
    marginTop: 20,
    marginVertical: 10,
    flexDirection: "row",
    justifyContent: "space-evenly",
    width: "100%",
  },
  loadingContainer: {
    width: 150,
    height: 150,
    justifyContent: "center",
    alignItems: "center",
  },
});
