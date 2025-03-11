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
  ScrollView,
  FlatList,
  Dimensions,
  TouchableOpacity,
  Alert,
  ImageBackground,
  SafeAreaView,
} from "react-native";
import { useRouter, Link } from "expo-router";
import theme from "@/src/theme/theme";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import PlotDisplayer from "./plots";

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
      <SafeAreaView style={styles.background}>
        <TouchableOpacity
          style={styles.summaryWrapper}
          onPress={() => router.push("/tabs/export/generating")}
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
                <Text style={styles.cardTitle}>Generate Suggestions</Text>
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
        <TouchableOpacity
          style={styles.summaryWrapper}
          onPress={() => router.push("/tabs/export/plots")}
        >
          <LinearGradient
            colors={["#69BBDE", "#5CA2C0", theme.colors.darkPurple]}
            locations={[0, 0.1, 1]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={[styles.gradient]}
          >
            <View style={styles.summaryContainer}>
              <View style={styles.summaryContent}>
                <Text style={styles.cardTitle}>Health Plots</Text>
                <Text style={styles.cardSubtitle}>
                  Get an overview glance at your logging history, including
                  trends and insights.
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
      </SafeAreaView>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    paddingTop: theme.spacing.xxl * 2,
    paddingBottom: theme.spacing.xxl,
    justifyContent: "center",
  },
  summaryWrapper: {
    margin: theme.spacing.md,
    flex: 1,
  },
  gradient: {
    borderRadius: theme.radius.lg,
    flex: 1,
  },
  summaryContainer: {
    flexDirection: "row",
    maxWidth: width - theme.spacing.lg * 2,
    borderRadius: theme.radius.lg,
    padding: theme.spacing.md,
  },
  summaryContent: {
    height: "100%",
    flexDirection: "column",
    // justifyContent: "space-around",
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
    fontWeight: "bold",
    fontFamily: theme.typography.fonts.bold, // erm... why is she not bold...
    marginBottom: theme.spacing.sm,
  },
  cardSubtitle: {
    color: "white",
    opacity: 0.8,
    fontFamily: theme.typography.fonts.regular, // also not bold ??
    fontSize: theme.typography.sizes.lg,
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
    fontFamily: theme.typography.fonts.bold,
    marginBottom: theme.spacing.lg,
  },
  logItem: {
    fontFamily: theme.typography.fonts.regular,
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
    fontFamily: theme.typography.fonts.regular,
  },
});
