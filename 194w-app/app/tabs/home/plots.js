import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet } from "react-native";
import { fetchCountData, getHighestPainRatingPerDay } from "../../utils/supabase-helpers";
import { VictoryChart, VictoryLine, VictoryAxis, VictoryTheme } from "victory-native";

// Pain Chart Component
const PainChart = ({ data }) => {
    if (!data || data.length === 0) {
        return <Text>Loading data...</Text>;
    }

    // Format data for VictoryChart
    const formattedData = data.map(d => ({
        x: new Date(d.day),  // Convert string to Date object
        y: d.pain_rating
    }));
    console.log("formatted data: ", formattedData);
    return (
      <VictoryChart theme={VictoryTheme.material} scale={{ x: "time" }}>
          <VictoryAxis 
              tickFormat={(t) => 
                  new Date(t).toLocaleDateString("en-US", { month: "short", day: "numeric" })
              } 
          />
          <VictoryAxis dependentAxis />
          <VictoryLine 
              data={formattedData} 
              style={{ data: { stroke: "#c43a31" } }} 
          />
      </VictoryChart>
  );
};

// Parent Component: Fetch Data and Pass to PainChart
const PainTracker = () => {
    const [data, setData] = useState([]);

    // Async function to fetch data
    async function fetchData() {
        try {
            const response = await getHighestPainRatingPerDay();
            setData(response);
            console.log("HighestPainRatingPerDay: ", response);

            await fetchCountData();
        } catch (error) {
            console.error("Error fetching data getHighestPainRatingPerDay:", error);
        }
    }

    // Fetch data on component mount
    useEffect(() => {
        fetchData();
    }, []);
    return (
      <View style={styles.container}>
          <Text style={styles.title}>Highest Pain Severity Over Time</Text>
          <PainChart data={data} />
      </View>
    );
};

export default PainTracker;

const styles = StyleSheet.create({
  container: {
      flex: 1,
      alignItems: "center",
      justifyContent: "center",
      padding: 20
  },
  title: {
      fontSize: 20,
      fontWeight: "bold",
      marginBottom: 10
  }
});

// Sample data
// const data = [
//   { x: new Date(2024, 0, 1), y: 10 },
//   { x: new Date(2024, 0, 5), y: 25 },
//   { x: new Date(2024, 0, 10), y: 15 },
//   { x: new Date(2024, 0, 15), y: 30 },
//   { x: new Date(2024, 0, 20), y: 20 }
// ];