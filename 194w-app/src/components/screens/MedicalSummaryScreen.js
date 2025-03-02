import React, { useState, useEffect } from "react";
import {
  SafeAreaView,
  View,
  ActivityIndicator,
  Alert,
  Text,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import { useRouter, Link } from "expo-router";
import * as Print from "expo-print";
import * as Sharing from "expo-sharing";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import theme from "@/src/theme/theme";
import { extractExport } from "@/src/lib/api/togetherai";
import { format } from "date-fns";
import { useSuggestionStore } from "@/src/store/suggestionStore";
import Header from "@/src/components/ui/MedicalSummaryHeader";

// TODO: fetch data from supabase
const JOURNAL_ENTRY =
  "I started feeling extremely fatigued three days ago. At first, it was mild, but by the second day, I felt so exhausted that even small tasks like walking to the kitchen felt draining. I also started experiencing dizziness, especially when standing up quickly. Yesterday, I noticed nausea that made it difficult to eat, and this morning, I nearly vomited after trying to have breakfast. The symptoms seem to be getting worse each day."; // Example text
const DIAGNOSES = ["Anemia", "Gastroenteritis"];

const MedicalSummaryScreen = ({
  dateTime,
  suggestions,
  handleGeneratePDF,
  handleSharePDF,
}) => {
  return (
    <SafeAreaView style={styles.container}>
      <MedicalSummaryHeader
        handleGeneratePDF={handleGeneratePDF}
        handleSharePDF={handleSharePDF}
      />
      <View style={styles.content}>
        <Text style={styles.title}>Comprehensive Summary</Text>
        <Text style={styles.date}>Generated on {dateTime}</Text>

        <Section
          title="What you can bring up during your next appointment"
          items={suggestions}
        />
        <Section title="Reminder of relevant diagnoses" items={DIAGNOSES} />
      </View>
      <View style={styles.footer}>
        <Text style={styles.pageNumber}>Page 1/1</Text>
      </View>
    </SafeAreaView>
  );
};

const Section = ({ title, items }) => (
  <View style={styles.section}>
    <Text style={styles.sectionTitle}>{title}</Text>
    {items.map((item, index) => (
      <View key={index} style={styles.listItem}>
        <Text style={styles.listNumber}>{index + 1}.</Text>
        <Text style={styles.listText}>{item}</Text>
      </View>
    ))}
  </View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.darkBlue,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
    backgroundColor: theme.colors.darkBlue,
  },
  headerIcons: {
    flexDirection: "row",
    gap: 20,
  },
  content: {
    flex: 1,
    padding: 20,
    backgroundColor: "white",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 8,
  },
  date: {
    fontSize: 16,
    color: "#666",
    marginBottom: 24,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "600",
    marginBottom: 16,
  },
  listItem: {
    flexDirection: "row",
    marginBottom: 12,
    paddingRight: 16,
  },
  listNumber: {
    width: 24,
    fontSize: 16,
  },
  listText: {
    flex: 1,
    fontSize: 16,
    lineHeight: 22,
  },
  footer: {
    padding: 16,
    backgroundColor: theme.colors.darkPurple,
    alignItems: "center",
  },
  pageNumber: {
    color: "white",
    fontSize: 16,
  },
});

export default MedicalSummaryScreen;
