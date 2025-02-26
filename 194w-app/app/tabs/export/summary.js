import React, { useState, useEffect } from "react";
import {
  SafeAreaView,
  View,
  Button,
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

const GeneratePDF = () => {
  const [output, setOutput] = useState(false);
  const [loading, setLoading] = useState(false);
  const [pdfUri, setPdfUri] = useState(null);
  const [error, setError] = useState(null);
  const [dateTime, setDateTime] = useState(
    format(new Date(), "EEEE, MMMM dd, yyyy HH:mm")
  );
  const { setSuggestions, suggestions } = useSuggestionStore();

  const handleGeneratePDF = async () => {
    const journalEntry =
      "I started feeling extremely fatigued three days ago. At first, it was mild, but by the second day, I felt so exhausted that even small tasks like walking to the kitchen felt draining. I also started experiencing dizziness, especially when standing up quickly. Yesterday, I noticed nausea that made it difficult to eat, and this morning, I nearly vomited after trying to have breakfast. The symptoms seem to be getting worse each day.";

    setLoading(true);
    try {
      const output = await extractExport(journalEntry);
      setDateTime(format(new Date(), "EEEE, MMMM dd, yyyy HH:mm"));
      setSuggestions(output);
      if (output.length === 0) {
        Alert.alert(
          "No keywords found",
          "Try again with a different journal entry."
        );
        setLoading(false);
        return;
      }

      const htmlContent = `
        <html>
          <body>
            <h1>Comprehensive Summary</h1>
            <p>Generated on ${dateTime}</p>

            <ul>
              ${output.map((keyword) => `<li>${keyword}</li>`).join("")}
            </ul>
          </body>
        </html>
      `;

      const { uri } = await Print.printToFileAsync({ html: htmlContent });
      setPdfUri(uri);
      Alert.alert("Success", "PDF generated successfully!");
    } catch (error) {
      console.error("❌ Error:", error);
      Alert.alert("Error", "Failed to generate PDF.");
    }
    setLoading(false);
  };

  useEffect(() => {
    const generatePDFOnLoad = async () => {
      // Set suggestions to output (or fetch it directly from your store)
      setOutput(suggestions);

      // Check if there are suggestions
      if (suggestions.length === 0) {
        Alert.alert("No suggestions found", "Please try again later.");
        return;
      }

      const htmlContent = `
        <html>
          <body>
            <h1>Comprehensive Summary</h1>
            <p>Generated on ${dateTime}</p>
            <ul>
              ${suggestions.map((keyword) => `<li>${keyword}</li>`).join("")}
            </ul>
          </body>
        </html>
      `;

      try {
        const { uri } = await Print.printToFileAsync({ html: htmlContent });
        setPdfUri(uri); // Set the PDF URI
        Alert.alert("Success", "PDF generated successfully!");
      } catch (error) {
        console.error("❌ Error:", error);
        Alert.alert("Error", "Failed to generate PDF.");
      }
    };

    generatePDFOnLoad(); // Call the async function
  }, []); // Empty dependency array ensures this runs once when the component mounts

  const handleSharePDF = async () => {
    if (!pdfUri) return;

    try {
      if (await Sharing.isAvailableAsync()) {
        await Sharing.shareAsync(pdfUri);
      } else {
        Alert.alert("Error", "Sharing is not available.");
      }
    } catch (error) {
      console.error("❌ Error sharing PDF:", error);
      Alert.alert("Error", "Failed to share PDF.");
    }
  };

  const MedicalSummaryScreen = () => {
    const router = useRouter();
    const diagnoses = ["OCD", "Arthritis"];
    const Header = () => (
      <View style={styles.header}>
        <Link href={"/tabs/export"}>
          <MaterialCommunityIcons size={24} name="arrow-left" color={"white"} />
        </Link>
        <View style={styles.headerIcons}>
          <TouchableOpacity onPress={handleGeneratePDF}>
            <MaterialCommunityIcons size={24} name="reload" color={"white"} />
          </TouchableOpacity>
          <TouchableOpacity>
            <MaterialCommunityIcons
              size={24}
              name="view-grid"
              color={"white"}
            />
          </TouchableOpacity>
          <TouchableOpacity onPress={handleSharePDF}>
            <MaterialCommunityIcons
              size={24}
              name="export-variant"
              color={"white"}
            />
          </TouchableOpacity>
          <TouchableOpacity>
            <MaterialCommunityIcons size={24} name="bookmark" color={"white"} />
          </TouchableOpacity>
        </View>
      </View>
    );

    return (
      <SafeAreaView style={styles.container}>
        <Header />
        <View style={styles.content}>
          <Text style={styles.title}>Comprehensive Summary</Text>
          <Text style={styles.date}>Generated on {dateTime}</Text>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>
              What you can bring up during your next appointment
            </Text>
            {suggestions &&
              suggestions.map((symptom, index) => (
                <View key={index} style={styles.listItem}>
                  <Text style={styles.listNumber}>{index + 1}.</Text>
                  <Text style={styles.listText}>{symptom}</Text>
                </View>
              ))}
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>
              Reminder of relevant diagnoses
            </Text>
            {diagnoses.map((diagnosis, index) => (
              <View key={index} style={styles.listItem}>
                <Text style={styles.listNumber}>{index + 1}.</Text>
                <Text style={styles.listText}>{diagnosis}</Text>
              </View>
            ))}
          </View>
        </View>
        <View style={styles.footer}>
          <Text style={styles.pageNumber}>Page 1/3</Text>
        </View>
      </SafeAreaView>
    );
  };

  return (
    <View style={styles.container}>
      {loading && <ActivityIndicator size="large" color="blue" />}
      {error && <Text>{error}</Text>}
      <MedicalSummaryScreen />
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
  headerIcon: {
    color: "white",
    fontSize: 20,
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
