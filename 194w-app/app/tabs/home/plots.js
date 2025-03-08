import React, { useState, useEffect } from "react";
import { ScrollView, View, Text, StyleSheet } from "react-native";
import { fetchCountData, getHighestPainRatingPerDay } from "../../utils/supabase-helpers";
import { VictoryChart, VictoryLine, VictoryAxis, VictoryTheme, VictoryPie } from "victory-native";

// Pain Chart Component
const PainChart = ({ data }) => {
    if (!data || data.length === 0) {
        return; // <Text>Loading data...</Text>;
    }

    // Format data for VictoryChart
    const formattedData = data.map(d => ({
        x: new Date(d.day),  // Convert string to Date object
        y: d.pain_rating
    }));
    // console.log("formatted data: ", formattedData);
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Highest Pain Severity Over Time</Text>
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
      </View>
  );
};

// Pie chart component
const PieChart = ({ data, title }) => {
  if (!data || Object.keys(data).length === 0) {
      return; // <Text>Loading data...</Text>;
  }

  // Convert JSON object into an array format that VictoryPie understands
  const formattedData = Object.entries(data).map(([key, value]) => ({
      x: key,  // JSON key as x (label)
      y: value // JSON value as y (numeric data)
  }));
  
  // console.log("Pie chart formatted data: ", formattedData);
  return (
    <View style={styles.container}>
        <Text style={styles.title}> Most Common {title} </Text>
        <VictoryPie 
            data={formattedData}
            colorScale={["#4CAF50", "#FF9800", "#2196F3", "#E91E63", "#9C27B0"]}
            labelRadius={50}
            labels={({ datum }) => `${datum.x}: ${datum.y}`} // Display both key and value
            style={{
                labels: { fill: "white", fontSize: 14, fontWeight: "bold" }
            }}
        />
    </View>
  );
};

// Parent Component: Fetch Data and Pass to PainChart
const PlotDisplayer = () => {
    const [pain_data, setPainData] = useState([]);
    const [count_data, setCountData] = useState([]); 

    // Async function to fetch data
    async function fetchPainData() {
        try {
            const response = await getHighestPainRatingPerDay();
            setPainData(response);
            // console.log("HighestPainRatingPerDay: ", response);
        } catch (error) {
            console.error("Error fetching pain data:", error);
        }
    }
    async function getCountData() {
      try {
          const response = await fetchCountData();
          setCountData(response);
          console.log("fetch count data: ", response);
      } catch (error) {
          console.error("Error fetching count data:", error);
      }
    }

    // Fetch data on component mount
    useEffect(() => {
        fetchPainData();
        getCountData();
    }, []);
    return (
      <ScrollView >
        <View style={styles.container}>
            <PainChart data={pain_data} />

            <PieChart data={count_data.duration} title="Durations"/>

            <PieChart data={count_data["when-does-it-hurt"]} title="Timings" />

            <PieChart data={count_data.concerns} title="Concerns"/>

            <PieChart data={count_data.causes} title="Causes"/>
        </View>
      </ScrollView>
    );
};

export default PlotDisplayer;

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