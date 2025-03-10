import { SafeAreaView, View, Text, StyleSheet, ScrollView } from "react-native";
import theme from "@/src/theme/theme";
import { useSuggestionStore } from "@/src/store/suggestionStore";
import { useUserPainStore } from "@/src/store/userPainStore";
import MedicalSummaryHeader from "@/src/components/ui/MedicalSummaryHeader";

// TODO: fetch data from supabase
//const DIAGNOSES = ["Anemia", "Gastroenteritis"];

const MedicalSummaryScreen = ({
  dateTime,
  painType,
  painDuration,
  handleGeneratePDF,
  handleSharePDF,
}) => {
  const { suggestions } = useSuggestionStore();

  return (
    <SafeAreaView style={styles.container}>
      <MedicalSummaryHeader
        handleGeneratePDF={handleGeneratePDF}
        handleSharePDF={handleSharePDF}
      />
      <View style={styles.content}>
        <ScrollView>
          <Text style={styles.title}>Comprehensive Summary</Text>
          <Text style={styles.date}>Generated on {dateTime}</Text>

          <Section
            title="What you can bring up during your next appointment"
            items={suggestions}
          />
          <Section
            title="Pain History"
            items={[
              `You have reported experiencing ${painType} for ${painDuration}.`,
            ]}
          />
        </ScrollView>
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
