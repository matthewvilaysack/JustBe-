/**
 * NOTES
 * - hardcoded log, need to connect to backend
 * - need to fill in summary.js and connect to AI
 * - need to figure out how to copy the gradient background from figma for all the buttons' backgrounds
 * - for some reason the bold text isnt bolded ???
 * - odd white header... where is that coming from
 */
import { useState, useEffect } from "react";
import {
  StyleSheet,
  Text,
  View,
  FlatList,
  Dimensions,
  TouchableOpacity,
  Alert,
  ScrollView,
  ImageBackground,
} from "react-native";
import { useRouter, Link } from "expo-router";
import theme from "@/src/theme/theme";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { Calendar } from "react-native-calendars";

const { width } = Dimensions.get("window");

// TEMPORARY HARDCODED LOGS need to link to backend later
const logs = [
  {
    id: "1",
    date: "2025-02-10",
    summary: "Moderate Pain Headache",
    text: "My head has had a constant low ache in the front, and sometimes I get a throbbing pain as well.",
  },
  {
    id: "2",
    date: "2025-02-14",
    summary: "Mild Fever",
    text: "I woke up with a cold and my temperature is a little high at 100 degrees.",
  },
  {
    id: "3",
    date: "2025-02-17",
    summary: "Severe Back Pain",
    text: "My lower back hurts after sitting at the office the whole day, even when I'm laying down.",
  },
];

export default function Export() {
  const router = useRouter();
  const [selectedDate, setSelectedDate] = useState(null);
  const today = new Date().toISOString().split("T")[0];

  useEffect(() => {
    setSelectedDate(today);
  }, []);

  const selectedLog = logs.find((log) => log.date === selectedDate);

  const markedDates = logs.reduce((acc, log) => {
    acc[log.date] = { marked: true, dotColor: "purple" };
    return acc;
  }, {});

  return (
    <ScrollView>
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

        <View style={styles.calendarContainer}>
          <Calendar
            onDayPress={(day) => setSelectedDate(day.dateString)}
            markedDates={{
              ...markedDates,
              ...(selectedDate && {
                [selectedDate]: { selected: true, selectedColor: "#5CA2C0" },
              }),
            }}
            style={styles.calendar}
            theme={{
              arrowColor: "white",
              //calendarBackground: "red",
              selectedDayBackgroundColor: "#5CA2C0",
              todayTextColor: "red",
              textMonthFontSize: 18,
            }}
          />
        </View>

        <View style={styles.logContainer}>
          <LinearGradient
            colors={["#69BBDE", "#5CA2C0", "#6580D8", "#8794E3"]}
            locations={[0, 0.01, 0.8, 1]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={[styles.gradient, { padding: theme.spacing.md }]}
          >
            <Text style={styles.sectionTitle}>Log History</Text>

            {selectedLog ? (
              <View style={styles.logContent}>
                <Text style={styles.logDate}>{selectedLog.date}</Text>
                <Text style={styles.logDate}>{selectedLog.summary}</Text>
                <Text style={styles.logText}>{selectedLog.text}</Text>
              </View>
            ) : (
              <Text style={styles.logText}>
                {selectedDate === today
                  ? "You haven't created a log today yet."
                  : "No log available for this date."}
              </Text>
            )}
          </LinearGradient>
        </View>
      </ImageBackground>
    </ScrollView>
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
    padding: theme.spacing.lg,
    borderRadius: theme.radius.lg,
    position: "relative",
  },
  cardTitle: {
    fontSize: theme.typography.sizes.xl,
    color: "white",
    fontWeight: "bold",
    fontFamily: theme.typography.fonts.bold,
    marginBottom: theme.spacing.sm,
  },
  cardSubtitle: {
    color: "white",
    opacity: 0.8,
    fontFamily: theme.typography.fonts.regular,
    fontSize: theme.typography.sizes.lg,
    marginBottom: theme.spacing.md,
  },

  arrow: {
    top: "50%",
    transform: [{ translateY: -12 }],
    marginLeft: theme.spacing.md,
  },
  logContainer: {
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
    justifyContent: "space-around",
    marginBottom: theme.spacing.sm,
  },
  calendarContainer: {
    marginTop: theme.spacing.md,
    marginHorizontal: theme.spacing.md,
    borderRadius: 15,
    overflow: "hidden",
  },
  calendar: {
    backgroundColor: theme.colors.testColor,
    elevation: 5,
    // is this shadow actually doing anything...
    shadowColor: "#000",
    shadowOpacity: 0.3,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
  },
  logDate: {
    fontSize: theme.typography.sizes.md,
    color: "white",
    fontFamily: theme.typography.fonts.bold,
    marginBottom: theme.spacing.sm,
  },
  logText: {
    flex: 1,
    fontSize: theme.typography.sizes.md,
    color: "white",
    marginLeft: theme.spacing.sm,
    //marginTop: theme.spacing.sm,
    fontFamily: theme.typography.fonts.regular,
    //alignSelf: "center",
  },
  logContent: {
    //padding: 15,
    //backgroundColor: "rgba(255,255,255,0.2)",
    marginBottom: theme.spacing.sm,
    borderRadius: 10,
  },
});
