import React, { useState, useEffect } from "react";
import { ScrollView, View, Text, StyleSheet } from "react-native";
import { fetchCountData, getHighestPainRatingPerDay } from "../../utils/supabase-helpers";
import { VictoryChart, VictoryLine, VictoryAxis, VictoryTheme, VictoryPie, VictoryBar } from "victory-native";
import Theme from "@/src/theme/theme";

const palette = [Theme.colors.darkPurple, "lightblue", Theme.colors.darkBlue, Theme.colors.purple, Theme.colors.testColor];

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
    <ScrollView horizontal showsHorizontalScrollIndicator={true}>
        <View style={styles.container}>
            <Text style={styles.title}>Highest Pain Severity Over Time</Text>
        
            <VictoryChart theme={VictoryTheme.clean} scale={{ x: "time" }}
            padding={{ left: 50, right: 50, top: 20, bottom: 50 }}>
                <VictoryAxis 
                    style={{
                        axis: { stroke: Theme.colors.lightBlue }, // Changes the axis line color
                        ticks: { stroke: Theme.colors.darkBlue}, // Changes tick color
                        tickLabels: { fill: Theme.colors.darkBlue, fontWeight: "bold" }, 
                    }}                
                    tickFormat={(t) => 
                        new Date(t).toLocaleDateString("en-US", { month: "short", day: "numeric" })
                    } 
                />
                <VictoryAxis dependentAxis 
                    style={{
                        axis: { stroke: Theme.colors.lightBlue }, // Changes the axis line color
                        ticks: { stroke: Theme.colors.darkBlue}, 
                        tickLabels: { fill: Theme.colors.darkBlue, fontWeight: "bold" }, 
                    }}/>
                <VictoryLine 
                    data={formattedData} 
                    style={{ data: { stroke: Theme.colors.darkPurple } }} 
                />
            </VictoryChart> 
        </View>
    </ScrollView>
       
  );
};

// Pie chart component
const PieChart = ({ data, title }) => {
  if (!data || Object.keys(data).length === 0) {
      return; // <Text>Loading data...</Text>;
  }
  if (Object.keys(data).length > 5) {
      return <BarChart data={data} title={title}/>
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
            // colorScale={["#4CAF50", "#FF9800", "#2196F3", "#E91E63", "#9C27B0"]}
            colorScale={palette}
            labelRadius={50}
            labels={({ datum }) => `${datum.x}: ${datum.y}`} // Display both key and value
            style={{
                labels: { fill: "white", fontSize: 14, fontWeight: "bold" }
            }}
        />
    </View>
  );
};

const BarChart = ({ data, title }) => {
    if (!data || Object.keys(data).length === 0) {
        return; // <Text>Loading data...</Text>;
    }
    const formattedData = Object.entries(data).map(([key, value]) => ({
        x: key,  // JSON key as x (label)
        y: value // JSON value as y (numeric data)
    }));
    
    const barWidth = 30;  // You can adjust this value
    // console.log("formattedData.length", formattedData.length);
    // console.log(Object.keys(data));
    const maxLabelLen = Object.keys(data).reduce((a, b) => a.length > b.length ? a : b).length 
    // console.log("Object.keys(jsonObject)" , maxLabelLen);
    const leftPad = 10+8*maxLabelLen;
    const chartWidth = formattedData.length * barWidth + (formattedData.length + 1) * 20;
    return (
        <ScrollView horizontal showsHorizontalScrollIndicator={true}>
      <View style={styles.container}>
      <Text style={styles.title}> Most Common {title} </Text>
        <VictoryChart 
          theme={VictoryTheme.clean} 
          domainPadding={20}
          height={chartWidth}
          width = {chartWidth + 100}
          padding={{ left: leftPad, bottom: 50 }}
        >
          {/* X-axis */}
          <VictoryAxis 
          style={{
            axis: { stroke: Theme.colors.lightBlue }, // Changes the axis line color
            ticks: { stroke: Theme.colors.white}, // Changes tick color
            tickLabels: { fill: Theme.colors.white, fontWeight: "bold", fontSize: 14, padding: 10 } 
            }} />
  
  
          {/* Y-axis */}
          <VictoryAxis dependentAxis style={{
            axis: { stroke: Theme.colors.lightBlue }, // Changes the axis line color
            ticks: { stroke: Theme.colors.white}, // Changes tick color
            tickLabels: { fill: Theme.colors.white, fontWeight: "bold", fontSize: 14,  } }} />
  
          {/* Bar chart */}
          <VictoryBar data={formattedData} 
          barWidth={barWidth}
          barRatio={1}
          horizontal={true}
          style={{
            data: {
                fillOpacity: 1,
                strokeWidth: 0,
                fill: ({ index }) => palette[index % palette.length] // Cycle through colors
            }
          }} />
        </VictoryChart>
      </View>
      </ScrollView>
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
        <View style={styles.container}>
            <PainChart data={pain_data}/>

            <PieChart data={count_data.duration} title="Durations"/>

            <PieChart data={count_data["when-does-it-hurt"]} title="Timings" />
            
            <PieChart data={count_data.causes} title="Causes"/>

            <PieChart data={count_data.concerns} title="Concerns"/>

            <PieChart data={count_data.pain_rating} title="Pain Ratings"/>
            
            <PieChart data={count_data.symptoms} title="Symptoms"/>
        </View>
    );
};

export default PlotDisplayer;

const styles = StyleSheet.create({
  container: {
      flex: 1,
      alignItems: "center",
      justifyContent: "center",
      padding: 10
  },
  title: {
      fontSize: 20,
      fontWeight: "bold"
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