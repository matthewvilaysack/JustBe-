import { useEffect } from "react";
import { StyleSheet, View, ImageBackground, Text } from "react-native";
import Theme from "@/src/theme/theme";
import { useRouter } from "expo-router";
import LoadingThinkingBlob from "@/src/animations/LoadingThinkingBlob";
import { extractExport } from "@/src/lib/api/togetherai";
import {
  fetchDetailedEntriesForUser,
  formatEntriesForAI,
} from "../../utils/supabase-helpers";
import { useSuggestionStore } from "@/src/store/suggestionStore";
import { useUserPainStore } from "@/src/store/userPainStore";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function GeneratingPage() {
  const router = useRouter();
  const { setSuggestions } = useSuggestionStore();
  const { setPainType, setPainDuration } = useUserPainStore();

  useEffect(() => {
    const loadPainData = async () => {
      const storedType = (await AsyncStorage.getItem("painType")) || "Unknown";
      const storedDuration =
        (await AsyncStorage.getItem("painDuration")) || "Unknown";
      setPainType(storedType);
      setPainDuration(storedDuration);
    };

    const fetchData = async () => {
      try {
        await loadPainData();

        const entries = await fetchDetailedEntriesForUser();
        if (!entries) {
          Alert.alert(
            "No Entries",
            "Whoops, there were no journal entries found for your account!"
          );
          router.push("/tabs/home");
          return;
        }

        const combinedJournalText = formatEntriesForAI(entries);
        console.log("raw combined text:", combinedJournalText);
        const output = await extractExport(combinedJournalText);
        if (!output.length) {
          Alert.alert(
            "No Suggestions",
            "Hm, we couldn't generate any suggestions... please try again when you've recorded more logs."
          );
          return;
        }
        setSuggestions(output);
        router.push("/tabs/export/summary");
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  return (
    <ImageBackground
      source={require("@/assets/background.png")}
      resizeMode="cover"
      style={styles.background}
    >
      <View style={styles.container}>
        <Text style={styles.heading}>Generating Summary...</Text>
        <View style={styles.blobImage}>
          <LoadingThinkingBlob />
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
    marginTop: Theme.spacing.xl,
    marginTop: Theme.spacing.xl,
  },
});
