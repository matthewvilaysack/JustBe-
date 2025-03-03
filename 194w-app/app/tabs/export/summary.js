import React, { useState, useEffect } from "react";
import { View, ActivityIndicator, Alert, StyleSheet } from "react-native";
import * as Print from "expo-print";
import * as Sharing from "expo-sharing";
import theme from "@/src/theme/theme";
import {
  fetchDetailedEntriesForUser,
  formatEntriesForAI,
} from "../../utils/supabase-helpers";
import { extractExport } from "@/src/lib/api/togetherai";
import { format } from "date-fns";
import { useSuggestionStore } from "@/src/store/suggestionStore";
import MedicalSummaryScreen from "@/src/components/screens/MedicalSummaryScreen";

// TODO: fetch diagnoses from supabase
const DIAGNOSES = ["Anemia", "Gastroenteritis"];

const GeneratePDF = () => {
  const [loading, setLoading] = useState(false);
  const [pdfUri, setPdfUri] = useState(null);
  const [dateTime, setDateTime] = useState(
    format(new Date(), "EEEE, MMMM dd, yyyy HH:mm")
  );
  const { suggestions, setSuggestions } = useSuggestionStore();

  useEffect(() => {
    if (suggestions.length > 0) generatePDF(suggestions);
  }, []);

  const generatePDF = async (data) => {
    setLoading(true);
    setDateTime(format(new Date(), "EEEE, MMMM dd, yyyy HH:mm"));
    const htmlContent = `
      <html>
        <body>
          <h1>Comprehensive Summary</h1>
          <p>Generated on ${dateTime}</p>
          <h2>What you can bring up during your next appointment</h2>
          <ol>${data.map((keyword) => `<li>${keyword}</li>`).join("")}</ol>
          <h2>Reminder of relevant diagnoses</h2>
          <ul>${DIAGNOSES.map((diagnosis) => `<li>${diagnosis}</li>`).join(
            ""
          )}</ul>
        </body>
      </html>
    `;
    try {
      const { uri } = await Print.printToFileAsync({ html: htmlContent });
      setPdfUri(uri);
      Alert.alert("Success", "PDF generated successfully!");
    } catch (error) {
      console.error("❌ Error:", error);
      Alert.alert("Error", "Failed to generate PDF. Please try again.");
    }
    setLoading(false);
  };

  const handleGeneratePDF = async () => {
    setLoading(true);

    try {
      const entries = await fetchDetailedEntriesForUser();
      if (!entries) {
        Alert.alert("No Entries", "No journal entries found for your account.");
        router.push("/tabs/home"); // Redirect to a safer page if no entry found
        return;
      }

      const combinedJournalText = formatEntriesForAI(entries);
      const output = await extractExport(combinedJournalText);

      if (!output.length) {
        Alert.alert(
          "No keywords found",
          "Try again with a different journal entry."
        );
        return;
      }
      setSuggestions(output);
      generatePDF(suggestions);
    } catch (error) {
      console.error("❌ Error:", error);
      Alert.alert("Error", "Failed to retrieve suggestions. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleSharePDF = async () => {
    if (!pdfUri) return;
    try {
      if (await Sharing.isAvailableAsync()) await Sharing.shareAsync(pdfUri);
      else Alert.alert("Error", "Sharing is not available.");
    } catch (error) {
      console.error("❌ Error sharing PDF:", error);
      Alert.alert("Error", "Failed to share PDF.");
    }
  };

  return (
    <View style={styles.container}>
      {loading && <ActivityIndicator size="large" color="blue" />}
      <MedicalSummaryScreen
        dateTime={dateTime}
        handleGeneratePDF={handleGeneratePDF}
        handleSharePDF={handleSharePDF}
      />
    </View>
  );
};

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

export default GeneratePDF;
