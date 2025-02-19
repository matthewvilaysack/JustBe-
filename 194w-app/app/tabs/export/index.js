/**
 * NOTES
 * - hardcoded log, need to connect to backend
 * - need to fill in summary.js and connect to AI
 * - need to figure out how to copy the gradient background from figma for all the buttons' backgrounds
 * - for some reason the bold text isnt bolded ???
 * - odd white header... where is that coming from
 */

import {
  StyleSheet,
  Text,
  View,
  FlatList,
  Dimensions,
  TouchableOpacity,
  Alert,
  ImageBackground,
} from "react-native";
import { useRouter, Link } from "expo-router";
import theme from "@/src/theme/theme";
import { Ionicons } from "@expo/vector-icons";

const { width } = Dimensions.get("window");

// TEMPORARY HARDCODED LOGS need to link to backend later
const logs = [
  { id: "1", date: "Feb 10", summary: "Moderate Pain Headache" },
  { id: "2", date: "Feb 10", summary: "Moderate Pain Headache" },
  { id: "3", date: "Feb 10", summary: "Moderate Pain Headache" },
  { id: "4", date: "Feb 10", summary: "Moderate Pain Headache" },
  { id: "5", date: "Feb 10", summary: "Moderate Pain Headache" },
];

export default function Export() {
  const router = useRouter();
  return (
    <ImageBackground
      source={require("@/assets/background.png")}
      resizeMode="cover"
      style={styles.background}
    >
      <TouchableOpacity
        style={styles.card}
        onPress={() => router.push("/tabs/export/summary")}
      >
        <Text style={styles.cardTitle}>Generate summary</Text>
        <Text style={styles.cardSubtitle}>
          Prepare for your medical appointment by generating a complete and
          formal summary of your logs.
        </Text>
        <Ionicons
          name="chevron-forward"
          size={24}
          color="white"
          style={styles.arrow}
        />
      </TouchableOpacity>

      <View style={styles.logContainer}>
        <Text style={styles.sectionTitle}>Log History</Text>
        <FlatList
          data={logs}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={styles.logItem}
              onPress={() => router.push("/tabs/export/log_single")}
            >
              <Text style={styles.logDate}>{item.date}</Text>
              <Text style={styles.logText}>{item.summary}</Text>
              <Ionicons name="chevron-forward" size={20} color="white" />
            </TouchableOpacity>
          )}
          contentContainerStyle={{ paddingBottom: 80 }}
        />
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
  },
  card: {
    //backgroundColor: theme.colors.lightBlue,  // need to figure out how to copy the gradient background on figma
    padding: theme.spacing.lg,
    borderRadius: theme.radius.lg,
    position: "relative",
  },
  cardTitle: {
    fontSize: theme.typography.sizes.lg,
    color: "white",
    fontFamily: theme.typography.fonts.bold, // erm... why is she not bold...
    marginBottom: theme.spacing.sm,
  },
  cardSubtitle: {
    color: "white",
    opacity: 0.8,
    fontSize: theme.typography.sizes.md,
    marginBottom: theme.spacing.md,
  },
  arrow: {
    position: "absolute",
    right: theme.spacing.md,
    top: "50%",
    transform: [{ translateY: -12 }],
  },
  logContainer: {
    //backgroundColor: theme.colors.lightBlue,  // need to figure out how to copy the gradient background on figma
    padding: theme.spacing.lg,
  },
  sectionTitle: {
    fontSize: theme.typography.sizes.lg,
    color: "white",
    fontFamily: theme.typography.fonts.bold, // also not bold ??
    marginVertical: theme.spacing.lg,
  },
  logItem: {
    backgroundColor: theme.colors.primaryDark,
    padding: theme.spacing.md,
    borderRadius: theme.radius.md,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: theme.spacing.sm,
  },
  logDate: {
    fontSize: theme.typography.sizes.md,
    color: "white",
    fontFamily: theme.typography.fonts.bold,
  },
  logText: {
    flex: 1,
    fontSize: theme.typography.sizes.md,
    color: "white",
    marginLeft: theme.spacing.sm,
  },
});
