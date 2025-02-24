import React from 'react';
import {
  SafeAreaView,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import { useRouter } from "expo-router";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import theme from '@/src/theme/theme';



const MedicalSummaryScreen = () => {
    const router = useRouter();
  
  const currentDate = "Sun Feb 23 8:05 PM";
  
  const symptoms = [
    "I had a runny nose yesterday morning, but by the afternoon, it turned into a dry cough.",
    "I couldn't sleep last night because the pain got worse when lying down.",
    "I started coughing four days ago. At first, it was just a dry cough, but since yesterday, I've had mucus and a mild fever.",
  ];

  const diagnoses = [
    "OCD",
    "Arthritis"
  ];

  const Header = () => (
    <View style={styles.header}>
      <TouchableOpacity onPress={() =>router.back()}>
      <MaterialCommunityIcons size={24} name="arrow-left" color={"white"} />
      </TouchableOpacity>
      <View style={styles.headerIcons}>
        <TouchableOpacity>
        <MaterialCommunityIcons size={24} name="reload" color={"white"} />
        </TouchableOpacity>
        <TouchableOpacity>
        <MaterialCommunityIcons size={24} name="view-grid" color={"white"} />
        </TouchableOpacity>
        <TouchableOpacity>
        <MaterialCommunityIcons size={24} name="export-variant" color={"white"} />
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
        <Text style={styles.title}>Complete Summary</Text>
        <Text style={styles.date}>Generated on {currentDate}</Text>
        
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>
            What you can bring up during your next appointment
          </Text>
          {symptoms.map((symptom, index) => (
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

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.darkBlue,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    backgroundColor: theme.colors.darkBlue,
  },
  headerIcons: {
    flexDirection: 'row',
    gap: 20,
  },
  headerIcon: {
    color: 'white',
    fontSize: 20,
  },
  content: {
    flex: 1,
    padding: 20,
    backgroundColor: 'white',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  date: {
    fontSize: 16,
    color: '#666',
    marginBottom: 24,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 16,
  },
  listItem: {
    flexDirection: 'row',
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
    backgroundColor: theme.colors.darkBlue,
    alignItems: 'center',
  },
  pageNumber: {
    color: 'white',
    fontSize: 16,
  },
});

export default MedicalSummaryScreen;
