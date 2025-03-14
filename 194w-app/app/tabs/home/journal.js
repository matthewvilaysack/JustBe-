import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  View,
  ImageBackground,
  Text,
  TextInput,
  Keyboard,
  TouchableWithoutFeedback,
  ActivityIndicator,
  Alert,
  Platform,
} from "react-native";
import { useRouter } from "expo-router";
import Theme from "@/src/theme/theme";
import NextButton from "@/src/components/ui/NextButton";
import BackButton from "@/src/components/ui/BackButton";
import { useQuery } from "@tanstack/react-query";
import { extractDetailedEntryJSON } from "@/src/lib/api/togetherai";
import { extractDetailedEntryJSON } from "@/src/lib/api/togetherai";
import { useKeywordStore } from "@/src/store/summaryStore";
import { usePainLevelStore } from "@/src/store/painlevelStore";
import { useJSONDataStore } from "@/src/store/jsonDataStore";
import { statusBarHeight } from "@/src/components/ui/Constants";
import { statusBarHeight } from "@/src/components/ui/Constants";
import { addNewDetailedEntry } from "../../utils/supabase-helpers";
import useJournalStore from "@/src/store/journalStore";

export default function Page() {
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);
  const [keyboardVisible, setKeyboardVisible] = useState(false);

  const router = useRouter();
  const now = new Date();
  const currentDate = new Date(now.getTime() - (now.getTimezoneOffset() * 60000))
    .toLocaleDateString();
  const { setKeywords, keywords } = useKeywordStore();
  const { setJSONData, jsonData } = useJSONDataStore();
  const { painLevel } = usePainLevelStore();
  const { addJournalLog } = useJournalStore();

  const { refetch } = useQuery({
    queryKey: ["keywords", text],
    queryFn: async () => {
      const fetchedJSON = await extractDetailedEntryJSON(text);
      let fetchedKeywords = [];
      for (const key in fetchedJSON) {
        if (fetchedJSON[key] != null) {
          fetchedKeywords.push(fetchedJSON[key]);
        }
      }
      console.log("Extracted Keywords:", fetchedKeywords);
      setKeywords(fetchedKeywords);
      setJSONData(fetchedJSON);
      return { keywords: fetchedKeywords, jsonData: fetchedJSON };
    },
    enabled: false,
  });

  /* call together ai fetched keywords/symptoms 
  - introducing temp fix of 3 retries as there is a cur POST/HTTP request 
  issue w ios, need to research further into issue
  */
  const fetchedKeywords = async (text) => {
    console.log("🔹 Fetching latest keywords...");
    try {
      const refetchResult = await refetch();
      const fetchedJSON = refetchResult.data?.jsonData || {};
      const symptoms = fetchedJSON.symptoms
        ? fetchedJSON.symptoms.split(",").map((s) => s.trim())
        : [];

      console.log("✅ Extracted Symptoms:", symptoms);

      if (!symptoms.length) {
        console.warn("⚠️ No keywords extracted.");
        router.push("/tabs/home/confirm");
        return { keywords: null, jsonData: null };
      }

      setKeywords(symptoms); // only symptoms now
      setJSONData(fetchedJSON);
      return { keywords: keywords, jsonData: fetchedJSON };
    } catch (error) {
      console.error(`❌ Error extracting keywords:`, error);

      if (retryCount === 0) {
        Alert.alert(
          "ACK!",
          "We couldn't process the journal entry. Would you like to retry?",
          [
            { text: "Cancel", style: "cancel" },
            { text: "Retry", onPress: () => fetchKeywords(text) },
          ]
        );
        return { keywords: null, jsonData: null };
      }
    }
    return { keywords: null, jsonData: null };
  };

  /* update supabase backend with fetched JSON/symptoms 
    - introducing temp fix of 3 retries as there is a cur POST/HTTP request 
  issue w ios, need to research further into issue
  */
  const saveToSupabase = async (updateData, retryCount = 3) => {
    console.log("🔹 Attempting to update Supabase...");
    while (retryCount > 0) {
      try {
        const { data, error } = await addNewDetailedEntry(updateData);

        if (error) {
          console.error(
            `❌ Supabase Error (Attempts left: ${retryCount - 1}):`,
            error
          );
          throw error;
        }

        if (!data || data.length === 0) {
          console.error("❌ Supabase returned null. Insert might have failed.");
          throw new Error("Supabase insert failed - No data returned.");
        }

        // eagerly add new log to journal store
        addJournalLog(data[0]);

        console.log("✅ Supabase Updated:", data);
        return true;
      } catch (err) {
        console.error(
          `❌ Supabase Update Failed (Attempts left: ${retryCount - 1}):`,
          err
        );
        retryCount--;
        if (retryCount === 0) {
          Alert.alert(
            "Saving Error",
            "Sorry, an unexpected issue occurred. Would you like to retry?",
            [
              { text: "Cancel", style: "cancel" },
              { text: "Retry", onPress: () => saveToSupabase(updateData, 3) },
            ]
          );
          return false;
        }
        console.warn(
          `⚠️ Retrying Supabase Update... ${retryCount} attempts left`
        );
        await new Promise((resolve) => setTimeout(resolve, 2000)); // Delay before retry
      }
    }
    return false;
  };

  /* display keywords screen */
  const displayKeywords = async (text, router) => {
    setLoading(true); // Show spinner at start
    const { keywords, jsonData } = await fetchedKeywords(text);
    if (!keywords || !jsonData) {
      setLoading(false); // Hide spinner if Together AI fails
      return;
    }
    console.log("Entry Text: ", text);
    console.log("Extracted JSON data", jsonData);

    // get json from LLM output, add entry_text and pain_rating
    const updateData = {
      ...jsonData,
      entry_text: text,
      pain_rating: painLevel,
    };

    const success = await saveToSupabase(updateData);
    setLoading(false); // Hide spinner after Supabase update completes
    if (!success) return; // stop if Supabase update fails

    router.push("/tabs/home/summary");
  };

  // Add keyboard listeners
  useEffect(() => {
    const keyboardDidShow = Keyboard.addListener(
      Platform.OS === 'ios' ? 'keyboardWillShow' : 'keyboardDidShow',
      () => setKeyboardVisible(true)
    );
    const keyboardDidHide = Keyboard.addListener(
      Platform.OS === 'ios' ? 'keyboardWillHide' : 'keyboardDidHide',
      () => setKeyboardVisible(false)
    );

    return () => {
      keyboardDidShow.remove();
      keyboardDidHide.remove();
    };
  }, []);

  const handleKeyPress = ({ nativeEvent }) => {
    if (nativeEvent.key === 'Enter') {
      Keyboard.dismiss();
    }
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
      <ImageBackground
        source={require("@/assets/background.png")}
        resizeMode="cover"
        style={styles.background}
      >
        <BackButton
          onPress={() => {
            router.back();
          }}
          showArrow={true}
        />

        <BackButton
          onPress={() => {
            router.back();
          }}
          showArrow={true}
        />

        <View style={styles.container}>
          <Text style={styles.heading}>What symptoms are you feeling?</Text>
          <View style={styles.journalContainer}>
            <Text style={styles.dateText}>{currentDate}</Text>
            <TextInput
              style={styles.textArea}
              multiline={true}
              numberOfLines={4}
              onChangeText={setText}
              value={text}
              placeholder="Type your journal entry here..."
              placeholderTextColor={Theme.colors.lightGray}
              returnKeyType="done"
              blurOnSubmit={true}
              onKeyPress={handleKeyPress}
              onSubmitEditing={() => Keyboard.dismiss()}
            />
          </View>
        </View>

        {loading && (
          <ActivityIndicator
            size="large"
            color="white"
            style={{ marginTop: 20 }}
          />
        )}

        <View style={[
          styles.footer,
          keyboardVisible && { marginBottom: Platform.OS === 'ios' ? 20 : 0 }
        ]}>
          <NextButton
            onPress={() => displayKeywords(text, router)}
            showArrow={true}
            disabled={text.trim().length === 0}
          />
        </View>
      </ImageBackground>
    </TouchableWithoutFeedback>
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
    paddingHorizontal: Theme.spacing.xl,
    paddingVertical: Theme.spacing.md,
    marginTop: statusBarHeight + Theme.spacing.xxl,
  },
  heading: {
    fontSize: Theme.typography.sizes.xl,
    color: Theme.colors.white,
    textAlign: "center",
    marginBottom: Theme.spacing.md,
    marginBottom: Theme.spacing.md,
    marginBottom: Theme.spacing.md,
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
    minWidth: "100%",
    borderRadius: Theme.radius.lg,
    borderWidth: 1,
    borderColor: "gray",
    padding: 10,
    flex: 1,
  },
  textArea: {
    fontSize: Theme.typography.sizes.lg,
    fontSize: Theme.typography.sizes.lg,
    fontSize: Theme.typography.sizes.lg,
    fontFamily: Theme.typography.fonts.regular,
    minHeight: Theme.typography.sizes.lg * 5,
    maxHeight: "95%",
    marginHorizontal: Theme.spacing.sm,
  },
  buttonContainer: {
    position: "absolute",
    top: "7%",
    left: "3%",
    //opacity: 0.9,
  },
  errorText: { color: "red", marginTop: 10 },
  keywordsContainer: {
    marginTop: 20,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    padding: 15,
    borderRadius: 10,
    width: "90%",
  },
  keywordsHeading: {
    fontSize: Theme.typography.sizes.md,
    fontWeight: "bold",
    color: "white",
    marginBottom: 10,
  },
  keyword: { fontSize: Theme.typography.sizes.md, color: "white" },
  footer: {
    flexDirection: "row",
    justifyContent: "flex-end",
    paddingBottom: Theme.spacing.lg,
    paddingLeft: Theme.spacing.lg,
    paddingRight: Theme.spacing.lg,
  },
});
