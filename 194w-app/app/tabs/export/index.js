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
import { LinearGradient } from "expo-linear-gradient";

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
        style={styles.summaryWrapper}
        onPress={() => router.push("/tabs/export/summary")}
      >
        <LinearGradient
          colors={["#69BBDE", "#5CA2C0", "#2B4F8E"]}
          locations={[0, 0.05, 0.8]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.gradient}
        >
          <View style={styles.summaryContainer}>
            <View style={styles.summaryContent}>
              <Text style={styles.cardTitle}>Generate summary</Text>
              <Text style={styles.cardSubtitle}>
                Prepare for your medical appointment by generating a complete
                and formal summary of your logs.
              </Text>
            </View>
            <View style={styles.arrowContainer}>
              <Ionicons
                name="chevron-forward"
                size={24}
                color="white"
                style={styles.arrow}
              />
            </View>
          </View>
        </LinearGradient>
      </TouchableOpacity>
      <View style={styles.logContainer}>
        <LinearGradient
          colors={["#69BBDE", "#5CA2C0", "#6580D8", "#8794E3"]}
          locations={[0, 0.01, 0.8, 1]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={[styles.gradient, { padding: theme.spacing.md }]}
        >
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
        </LinearGradient>
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
  },
  summaryWrapper: {
    marginTop: theme.spacing.xxl * 2,
    marginHorizontal: theme.spacing.md,
  },
  gradient: {
    borderRadius: theme.radius.lg,
  },
  summaryContainer: {
    flexDirection: "row",
    maxWidth: width - theme.spacing.lg * 2,
    borderRadius: theme.radius.lg,
    padding: theme.spacing.md,
  },
  summaryContent: {
    flexDirection: "column",
  },
  card: {
    //backgroundColor: theme.colors.lightBlue,  // need to figure out how to copy the gradient background on figma
    padding: theme.spacing.lg,
    borderRadius: theme.radius.lg,
    position: "relative",
  },
  cardTitle: {
    fontSize: theme.typography.sizes.xl,
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
    top: "50%",
    transform: [{ translateY: -12 }],
    marginLeft: theme.spacing.md,
  },
  logContainer: {
    //backgroundColor: theme.colors.lightBlue,  // need to figure out how to copy the gradient background on figma
    padding: theme.spacing.md,
  },
  sectionTitle: {
    fontSize: theme.typography.sizes.xl,
    color: "white",
    fontFamily: theme.typography.fonts.bold, // also not bold ??
    marginBottom: theme.spacing.lg,
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
