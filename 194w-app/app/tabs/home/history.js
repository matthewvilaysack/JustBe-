import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  ImageBackground,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import { useRouter } from "expo-router";
import theme from "@/src/theme/theme";

import { LinearGradient } from "expo-linear-gradient";
import { Calendar } from "react-native-calendars";
import BackButton from "@/src/components/ui/BackButton";
import useJournalStore from "@/src/store/journalStore";

// date widget
const DateWidget = ({ selectedDate, today }) => {
  const formatDate = (date) => {
    return new Date(date + "T00:00:00").toLocaleDateString("en-US", {
      weekday: 'long',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <View style={styles.dateWidgetContainer}>
      <View style={styles.dateTextContainer}>
        <Text style={styles.dateLabel}>
          {selectedDate === today ? "Today" : "Selected Date"}
        </Text>
        <Text style={styles.dateText}>
          {formatDate(selectedDate)}
        </Text>
      </View>
    </View>
  );
};

// pain scale
const PainScale = ({ painRating, getPainColor }) => {
  const dots = Array(10).fill(0);
  return (
    <View style={styles.painScaleContainer}>
      {dots.map((_, index) => (
        <View
          key={index}
          style={[
            styles.painDot,
            {
              backgroundColor: index < painRating ? getPainColor(painRating) : '#ffffff40',
            },
          ]}
        />
      ))}
    </View>
  );
};

// tab selector
const TabSelector = ({ activeTab, onTabChange }) => {
  return (
    <View style={styles.tabContainer}>
      <View style={styles.tabLine} />
      <View style={styles.tabButtons}>
        <TouchableOpacity 
          style={[styles.tabButton, activeTab === 'logs' && styles.activeTabButton]} 
          onPress={() => onTabChange('logs')}
        >
          <Text style={[styles.tabText, activeTab === 'logs' && styles.activeTabText]}>Log History</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={[styles.tabButton, activeTab === 'calendar' && styles.activeTabButton]} 
          onPress={() => onTabChange('calendar')}
        >
          <Text style={[styles.tabText, activeTab === 'calendar' && styles.activeTabText]}>Calendar</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.tabLine} />
    </View>
  );
};

export default function History() {
  const router = useRouter();
  const [selectedDate, setSelectedDate] = useState(null);
  const [activeTab, setActiveTab] = useState('logs');
  
  // get today's date in the correct timezone format
  const now = new Date();
  const today = new Date(now.getTime() - (now.getTimezoneOffset() * 60000))
    .toISOString()
    .split('T')[0];
    
  const { journalLogs, isLoading, getLogsByDate, getJournalLogs } = useJournalStore();

  // load logs when component mounts
  useEffect(() => {
    const loadData = async () => {
      // set today as the selected date
      setSelectedDate(today);
      // fetch latest logs from the database
      await getJournalLogs();
    };
    
    loadData();
  }, []);

  // Get logs for the selected date
  const selectedLog = selectedDate ? getLogsByDate(selectedDate) : [];
  console.log("selectedLog", selectedLog); // Temp

  // Get the time that a log was created (helper fn)
  const formatLogTime = (timestamp) => {
    if (!timestamp) return "Unknown Time";
    return new Date(timestamp).toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  };

  // get pain level for log
  const getPainLevel = (pain_rating) => {
    if (pain_rating === 0) return "No Pain";
    if (pain_rating >= 1 && pain_rating <= 3) return "Mild Pain";
    if (pain_rating >= 4 && pain_rating <= 6) return "Moderate Pain";
    if (pain_rating >= 7 && pain_rating <= 9) return "Severe Pain";
    if (pain_rating === 10) return "Extreme Pain";
    return "Unknown Pain Level";
  };
  // get pain color for calendar, displaying severity back to user
  const getPainColor = (pain_rating) => {
    if (pain_rating === 0) return "rgba(0, 255, 0, 0.5)";
    if (pain_rating >= 1 && pain_rating <= 2) return "rgba(173, 255, 47, 0.7)";
    if (pain_rating >= 3 && pain_rating <= 4) return "rgba(255, 255, 0, 0.7)";
    if (pain_rating >= 5 && pain_rating <= 6) return "rgba(255, 165, 0, 0.8)";
    if (pain_rating >= 7 && pain_rating <= 8) return "rgba(255, 69, 0, 0.8)";
    if (pain_rating >= 9) return "rgba(255, 0, 0, 0.7)";
  };

  // create marked dates object from all journal logs
  const markedDates = Object.entries(journalLogs).reduce(
    (journalLogs, [date, logs]) => {
      if (logs.length === 0) return journalLogs;

      const maxPainLog = logs.reduce((maxLog, currentLog) =>
        currentLog.pain_rating > maxLog.pain_rating ? currentLog : maxLog
      );

      const painColor = getPainColor(maxPainLog.pain_rating);

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
    },
    {}
  );

  return (
    <ImageBackground
      source={require("@/assets/background.png")}
      resizeMode="cover"
      style={styles.background}
    >
      <View style={styles.buttonContainer}>
        <BackButton
          onPress={() => router.back()}
          showArrow={true}
        />
      </View>
      
      <View style={styles.contentContainer}>
        <DateWidget selectedDate={selectedDate} today={today} />
        <TabSelector activeTab={activeTab} onTabChange={setActiveTab} />
        <View style={styles.scrollcontainer}>
          <ScrollView>
            {activeTab === 'logs' ? (
              <View style={styles.logContainer}>
                <LinearGradient
                  colors={["#3B67B2", "#3B67B2", "#6580D8"]}
                  locations={[0, 0.5, 1]}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={[styles.gradient, { padding: theme.spacing.md }]}
                >
                  <Text style={styles.logDate}>
                    {new Date(selectedDate + "T00:00:00").toLocaleDateString(
                      "en-US",
                      {
                        month: "long",
                        day: "numeric",
                        weekday: "long",
                      }
                    )}
                  </Text>

                  {selectedLog && selectedLog.length > 0 ? (
                    selectedLog
                      .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
                      .map((log, index) => (
                        <View key={index} style={styles.logContent}>
                          <LinearGradient
                            colors={['#ffffff10', '#ffffff20']}
                            style={styles.logGradient}
                          >
                            <View style={styles.logHeader}>
                              <Text style={styles.logTime}>
                                {formatLogTime(log.created_at)}
                              </Text>
                              <Text style={[
                                styles.logPain, 
                                { 
                                  color: 'white',
                                  textDecorationColor: 'white',
                                  textDecorationStyle: 'solid',
                                }
                              ]}>
                                {getPainLevel(log.pain_rating)}
                              </Text>
                            </View>
                            
                            <PainScale 
                              painRating={log.pain_rating} 
                              getPainColor={getPainColor}
                            />
                            
                            <Text style={styles.logText}>
                              {log.entry_text}
                            </Text>
                            
                            {/* Additional Fields */}
                            {log.duration && (
                              <View style={styles.fieldContainer}>
                                <Text style={styles.fieldLabel}>Duration:</Text>
                                <Text style={styles.fieldText}>{log.duration}</Text>
                              </View>
                            )}
                            {log.sensation && (
                              <View style={styles.fieldContainer}>
                                <Text style={styles.fieldLabel}>Sensation:</Text>
                                <Text style={styles.fieldText}>{log.sensation}</Text>
                              </View>
                            )}
                            {log["what-happened"] && (
                              <View style={styles.fieldContainer}>
                                <Text style={styles.fieldLabel}>What Happened:</Text>
                                <Text style={styles.fieldText}>{log["what-happened"]}</Text>
                              </View>
                            )}
                            {log.concerns && (
                              <View style={styles.fieldContainer}>
                                <Text style={styles.fieldLabel}>Concerns:</Text>
                                <Text style={styles.fieldText}>{log.concerns}</Text>
                              </View>
                            )}
                            {log.causes && (
                              <View style={styles.fieldContainer}>
                                <Text style={styles.fieldLabel}>Causes:</Text>
                                <Text style={styles.fieldText}>{log.causes}</Text>
                              </View>
                            )}
                            {log["when-does-it-hurt"] && (
                              <View style={styles.fieldContainer}>
                                <Text style={styles.fieldLabel}>When Does it Hurt:</Text>
                                <Text style={styles.fieldText}>{log["when-does-it-hurt"]}</Text>
                              </View>
                            )}
                            {log.symptoms && (
                              <View style={styles.fieldContainer}>
                                <Text style={styles.fieldLabel}>Symptoms:</Text>
                                <Text style={styles.fieldText}>{log.symptoms}</Text>
                              </View>
                            )}
                          </LinearGradient>
                        </View>
                      ))
                  ) : (
                    <Text style={styles.logText}>
                      {selectedDate === today
                        ? "You haven't created a log today yet."
                        : "No log available for this date."}
                    </Text>
                  )}
                </LinearGradient>
              </View>
            ) : (
              <View style={styles.calendarContainer}>
                <LinearGradient
                  colors={["#3B67B2", "#3B67B2", "#6580D8"]}
                  locations={[0, 0.5, 1]}
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
                      calendarBackground: "transparent",
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
            )}
          </ScrollView>
        </View>
      </View>
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
    flex: 1,
    width: '100%',
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
    marginHorizontal: theme.spacing.md,
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
    marginHorizontal: theme.spacing.md,
    borderRadius: 15,
    overflow: "hidden",
  },
  calendarGradient: {
    borderRadius: 15,
    paddingBottom: 5,
  },
  calendar: {
    backgroundColor: "transparent",
    elevation: 5,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
  },
  logDate: {
    fontSize: theme.typography.sizes.lg,
    color: "white",
    fontFamily: theme.typography.fonts.bold,
    marginBottom: theme.spacing.md,
  },
  logContent: {
    marginBottom: 16,
    borderRadius: 12,
    overflow: 'hidden',
  },
  logGradient: {
    padding: 16,
    borderRadius: 12,
  },
  logHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  logTime: {
    fontSize: theme.typography.sizes.sm,
    color: '#FFFFFF80',
    fontFamily: theme.typography.fonts.regular,
  },
  logPain: {
    fontSize: theme.typography.sizes.md,
    fontFamily: theme.typography.fonts.bold,
    paddingBottom: 2,
  },
  painScaleContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
    padding: 8,
    backgroundColor: '#ffffff10',
    borderRadius: 8,
  },
  painDot: {
    width: 16,
    height: 16,
    borderRadius: 8,
    marginHorizontal: 2,
    paddingBottom: 2,
  },
  logText: {
    fontSize: theme.typography.sizes.md,
    color: '#FFFFFF',
    fontFamily: theme.typography.fonts.regular,
    lineHeight: 20,
  },
  buttonContainer: {
    position: "absolute",
    top: "5%",
    left: "5%",
    opacity: 0.9,
    zIndex: 10,
  },
  contentContainer: {
    flex: 1,
    alignItems: 'center',
    paddingTop: 60,
  },
  dateWidgetContainer: {
    width: 314,
    alignItems: 'center',
    marginBottom: 20,
    marginTop: 20,
  },
  dateTextContainer: {
    alignItems: 'center',
  },
  dateLabel: {
    fontFamily: 'Lexend Deca',
    fontSize: 14,
    color: '#9997E1',
    marginBottom: 4,
  },
  dateText: {
    fontFamily: 'Lexend Deca',
    fontSize: 18,
    lineHeight: 24,
    color: '#FFFFFF',
    textAlign: 'center',
    shadowColor: '#9997E1',
    shadowOffset: {
      width: 0,
      height: 0,
    },
    shadowOpacity: 0.8,
    shadowRadius: 8,
    elevation: 8,
  },
  tabContainer: {
    width: 314,
    height: 70,
    marginBottom: 10,
  },
  tabButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 10,
  },
  tabButton: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 8,
  },
  activeTabButton: {
    borderRadius: 8,
  },
  tabText: {
    fontFamily: 'Lexend Deca',
    fontSize: 16,
    color: '#FFFFFF80',
  },
  activeTabText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
  tabLine: {
    width: 314,
    height: 2,
    backgroundColor: '#7089E6',
    shadowColor: '#9997E1',
    shadowOffset: {
      width: 0,
      height: 0,
    },
    shadowOpacity: 0.8,
    shadowRadius: 8,
    elevation: 8,
  },
  fieldContainer: {
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#ffffff20',
  },
  fieldLabel: {
    fontSize: theme.typography.sizes.sm,
    color: '#FFFFFF80',
    fontFamily: theme.typography.fonts.bold,
    marginBottom: 4,
  },
  fieldText: {
    fontSize: theme.typography.sizes.md,
    color: '#FFFFFF',
    fontFamily: theme.typography.fonts.regular,
    lineHeight: 20,
  },
});
