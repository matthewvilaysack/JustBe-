import { useEffect } from "react";
import { StyleSheet, View, ImageBackground, Text } from "react-native";
import Theme from "@/src/theme/theme";
import { useRouter } from "expo-router";
import LoadingThinkingBlob from "@/src/animations/LoadingThinkingBlob";
import { extractExport } from "@/src/lib/api/togetherai";
import { fetchDetailedEntriesForUser, formatEntriesForAI } from "../../utils/supabase-helpers";
import { useSuggestionStore } from "@/src/store/suggestionStore";

export default function GeneratingPage() {
  const router = useRouter();
  const { setSuggestions } = useSuggestionStore();

  useEffect(() => {
    const fetchData = async () => {
      try {

        const entries = await fetchDetailedEntriesForUser();
        if (!entries) {
          Alert.alert("No Entries", "No journal entries found for your account.");
          router.push("/tabs/home");  // Redirect to a safer page if no entry found
          return;
        }

        const combinedJournalText = formatEntriesForAI(entries);
        const output = await extractExport(combinedJournalText);
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
        <LoadingThinkingBlob />
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
  },
});
