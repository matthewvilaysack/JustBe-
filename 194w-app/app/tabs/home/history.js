import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  ActivityIndicator,
  Dimensions,
  TouchableOpacity,
  Alert,
  ScrollView,
  ImageBackground,
  StyleSheet,
} from "react-native";
import { supabase } from "../../../src/lib/api/supabase";
import { useRouter, Link } from "expo-router";
import theme from "@/src/theme/theme";
import Theme from "@/src/theme/theme";

import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { Calendar } from "react-native-calendars";
import BackButton from "@/src/components/ui/BackButton";
import useJournalStore from "@/src/store/journalStore";
const { width } = Dimensions.get("window");


export default function Export() {
  const router = useRouter();
  const [selectedDate, setSelectedDate] = useState(null);
  const today = new Date().toISOString().split("T")[0];
  const { journalLogs, isLoading, getLogsByDate } = useJournalStore();

  useEffect(() => {
    setSelectedDate(today);
    // Fetch logs only if store is empty
    if (Object.keys(journalLogs).length === 0) {
      useJournalStore.getState().getJournalLogs();
    }
  }, []);

  // Get logs for the selected date
  const selectedLog = selectedDate ? getLogsByDate(selectedDate)[0] : null;
  console.log("selectedLog", selectedLog) // Temp 

  const getPainLevel = (pain_rating) => {
    if (pain_rating === 0) return "No Pain";
    if (pain_rating >= 1 && pain_rating <= 3) return "Mild Pain";
    if (pain_rating >= 4 && pain_rating <= 6) return "Moderate Pain";
    if (pain_rating >= 7 && pain_rating <= 9) return "Severe Pain";
    if (pain_rating === 10) return "Extreme Pain";
    return "Unknown Pain Level";
  };

  const getPainColor = (pain_rating) => {
    if (pain_rating === 0) return "rgba(0, 255, 0, 0.5)";
    if (pain_rating >= 1 && pain_rating <= 2) return "rgba(173, 255, 47, 0.7)";
    if (pain_rating >= 3 && pain_rating <= 4) return "rgba(255, 255, 0, 0.7)";
    if (pain_rating >= 5 && pain_rating <= 6) return "rgba(255, 165, 0, 0.8)";
    if (pain_rating >= 7 && pain_rating <= 8) return "rgba(255, 69, 0, 0.8)";
    if (pain_rating >= 9) return "rgba(255, 0, 0, 0.7)";
  };

  // Create marked dates object from all journal logs
  const markedDates = Object.entries(journalLogs).reduce((journalLogs, [date, logs]) => {
    if (logs.length === 0) return journalLogs;
    const painColor = getPainColor(logs[0].pain_rating);
    journalLogs[date] = {
      selected: true,
      selectedColor: painColor,
      customStyles: {
        container: {
          backgroundColor: painColor,
          borderRadius: 8,
          width: 35,
          height: 35,
        },
        text: {
          color: "white",
          fontWeight: "bold",
        },
      },
    };
    return journalLogs;
  }, {});

  return (
    <ImageBackground
      source={require("@/assets/background.png")}
      resizeMode="cover"
      style={styles.background}
    >
      <View style={styles.buttonContainer}>
        <BackButton
          onPress={() => {
            router.back();
          }}
          showArrow={true}
        />
      </View>
      <ScrollView style={styles.scrollcontainer}>
        <View style={styles.calendarContainer}>
          <LinearGradient
            colors={["#69BBDE", "#5CA2C0", "#2B4F8E", "#6580D8"]}
            locations={[0, 0.2, 0.9, 0.5]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.calendarGradient}
          >
            <Calendar
              onDayPress={(day) => setSelectedDate(day.dateString)}
              markedDates={markedDates}
              markingType="custom"
              style={styles.calendar}
              theme={{
                arrowColor: "white",
                calendarBackground: "transparent", //theme.colors.border.default,
                selectedDayBackgroundColor: "#20348a",
                selectedDayTextColor: "white",
                dayTextColor: "white",
                textDisabledColor: "#b8c0cc",
                todayTextColor: "#17336b",
                textMonthFontSize: 18,
                monthTextColor: "white",
                textDayFontFamily: theme.typography.fonts.regular,
                textMonthFontFamily: theme.typography.fonts.regular,
                textDayHeaderFontFamily: theme.typography.fonts.regular,
              }}
            />
          </LinearGradient>
        </View>

        <View style={styles.logContainer}>
          <LinearGradient
            colors={["#69BBDE", "#5CA2C0", "#6580D8", "#8794E3"]}
            locations={[0, 0.01, 0.7, 1]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={[styles.gradient, { padding: theme.spacing.md }]}
          >
            <Text style={styles.sectionTitle}>Log History</Text>
            <Text style={styles.logDate}>
              {new Date(selectedDate + "T00:00:00").toLocaleDateString("en-US", {
                month: "long",
                day: "numeric",
                weekday: "long",
              })}
            </Text>

            {selectedLog ? (
              <View style={styles.logContent}>
                <Text style={[styles.pain, { color: theme.colors.text.primary, fontSize: theme.typography.sizes.xl }]}> {getPainLevel(selectedLog.pain_rating)} </Text>
                <Text style={styles.logText}>{"What you said: " + selectedLog.entry_text}</Text>
                <Text style={styles.logText}>{"pain rating: " + (selectedLog.pain_rating !== null ? selectedLog.pain_rating : "N/A")}</Text>
                <Text style={styles.logText}>{"causes: " + (selectedLog.causes !== null ? selectedLog.causes : "N/A")}</Text>
                <Text style={styles.logText}>{"concerns: " + (selectedLog.concerns !== null ? selectedLog.concerns : "N/A")}</Text>
                <Text style={styles.logText}>{"duration: " + (selectedLog.duration !== null ? selectedLog.duration : "N/A")}</Text>
                <Text style={styles.logText}>{"symptoms: " + (selectedLog.symptoms !== null ? selectedLog.symptoms : "N/A")}</Text>
                <Text style={styles.logText}>{"what happened: " + (selectedLog["what-happened"] !== null ? selectedLog["what-happened"] : "N/A")}</Text>
                <Text style={styles.logText}>{"when does it hurt: " + (selectedLog["when-does-it-hurt"] !== null ? selectedLog["when-does-it-hurt"] : "N/A")}</Text>
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
      </ScrollView>
    </ImageBackground>
  );
}
const styles = StyleSheet.create({
  background: {
    flex: 1,
  },
  gradient: {
    borderRadius: theme.radius.lg,
  },
  scrollcontainer: {
    marginTop: "15%",
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
    marginTop: "20%",
  },
  calendarGradient: {
    borderRadius: 15,
    paddingBottom: 5,
  },
  calendar: {
    backgroundColor: "transparent",
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
  buttonContainer: {
    position: "absolute",
    top: "7%",
    left: "5%",
    opacity: 0.9,
    zIndex: 10,
  },
});

/*
*--------------------------------------------------------------------------------------
* CODE BELOW fetches logs from supabase - save for later to incorporate into front end
*

const FetchSupabaseData = () => {
  const [data, setData] = useState([]);
  const [error, setError] = useState(true);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
        
    const fetchData = async () => {
      const { data: journal_entries, err } = await supabase.from('journal_entries').select('*')
      if (err) {
        text = "err";
        setData(null);
        console.log("error") 
        console.error('Error fetching data:', err);
      } else {
        console.log("getting data");
        setData(journal_entries);
        setError(null);
      }
      setLoading(false);
    };        

    fetchData();
  }, []);

  if (loading) {
    return <ActivityIndicator size="large" style={styles.loader} />;
  }

  return (
    <View style={styles.container}>
    <FlatList
      data={data}
      keyExtractor={(item) => item.id.toString()}
      renderItem={({ item }) => (
        <View style={styles.item}>
          <Text>{JSON.stringify(item)}</Text>
        </View>
      )}
      />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  item: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  loader: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default FetchSupabaseData;

*/

