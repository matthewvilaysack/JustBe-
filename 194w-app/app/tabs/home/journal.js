import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  View,
  ImageBackground,
  Text,
  Dimensions,
  TextInput,
  Keyboard,
  TouchableWithoutFeedback,
  ScrollView,
  ActivityIndicator,
  Alert,
} from "react-native";
import Carousel from "react-native-reanimated-carousel";
import { useRouter } from "expo-router";
import Theme from "@/src/theme/theme";
import NextButton from "@/src/components/ui/NextButton";
import BackButton from "@/src/components/ui/BackButton";

import { useQuery } from "@tanstack/react-query";
import { extractKeywords } from "@/src/lib/api/togetherai";
import { supabase } from "../../../src/lib/api/supabase";
import { useKeywordStore } from "@/src/store/summaryStore";
import { use } from "@/src/store/painlevelStore";

export default function Page() {
  const [text, setText] = useState("");
  const router = useRouter();
  const currentDate = new Date().toLocaleDateString();
  const { setKeywords, keywords } = useKeywordStore();
  const { isLoading, isError, refetch } = useQuery({
    queryKey: ["keywords", text],
    queryFn: async () => {
      const fetchedKeywords = await extractKeywords(text);
      setKeywords(fetchedKeywords);
      return fetchedKeywords;
    },
    enabled: false,
  });

  const UpdateSupabaseData = async (text, router) => {
    try {
      await refetch();

      const { data, error } = await supabase.from("journal_entries").insert([
        { entry_text: text, pain_rating: 5, summary: "llm summary" }, // need to be filled in with actual user values
      ]);

      if (error) {
        Alert.alert(
          "Sorry, we encountered a problem on our end!",
          "Would you like to retry?",
          [
            {
              text: "Cancel",
              onPress: () => console.log("Cancel Pressed"),
              style: "cancel",
            },
            { text: "OK", onPress: () => UpdateSupabaseData(text, router) },
          ]
        );
        console.error("Error updating data:", error);
      } else {
        console.log("Updated data:");
        router.push("/tabs/home/summary");
      }
    } catch (err) {
      console.error("Unexpected error:", err);
    }
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
      <ImageBackground
        source={require("@/assets/background.png")}
        resizeMode="cover"
        style={styles.background}
      >
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
            />
          </View>
        </View>

        {isLoading && (
          <ActivityIndicator
            size="large"
            color="white"
            style={{ marginTop: 20 }}
          />
        )}

        <View style={styles.footer}>
          <BackButton
            onPress={() => {
              router.back();
            }}
            showArrow={true}
          />
          <NextButton
            onPress={() => UpdateSupabaseData(text, router)}
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
    justifyContent: "space-between",
    paddingBottom: Theme.spacing.lg,
    paddingLeft: Theme.spacing.lg,
    paddingRight: Theme.spacing.lg,
  },
});
