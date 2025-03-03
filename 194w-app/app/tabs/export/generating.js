import { useEffect } from "react";
import { StyleSheet, View, ImageBackground, Text } from "react-native";
import Theme from "@/src/theme/theme";
import { useRouter } from "expo-router";
import LoadingThinkingBlob from "@/src/animations/LoadingThinkingBlob";
import { extractExport } from "@/src/lib/api/togetherai";
import { useSuggestionStore } from "@/src/store/suggestionStore";

export default function GeneratingPage() {
  const router = useRouter();
  const { setSuggestions } = useSuggestionStore();

  useEffect(() => {
    const fetchData = async () => {
      try {
        // TODO: Replace this journal entry with your actual data
        const journalEntry =
          "I started feeling extremely fatigued three days ago. At first, it was mild, but by the second day, I felt so exhausted that even small tasks like walking to the kitchen felt draining. I also started experiencing dizziness, especially when standing up quickly. Yesterday, I noticed nausea that made it difficult to eat, and this morning, I nearly vomited after trying to have breakfast. The symptoms seem to be getting worse each day.";
        const output = await extractExport(journalEntry);
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
