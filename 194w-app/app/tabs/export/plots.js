import React, { useState, useEffect } from "react";
import {
  ScrollView,
  View,
  Text,
  StyleSheet,
  Dimensions,
  ImageBackground,
  SafeAreaView,
} from "react-native";
import {
  fetchCountData,
  getHighestPainRatingPerDay,
} from "../../utils/supabase-helpers";
import {
  VictoryChart,
  VictoryLine,
  VictoryAxis,
  VictoryTheme,
  VictoryPie,
  VictoryBar,
  VictoryLabel,
  VictoryTooltip,
} from "victory-native";
import { useRouter } from "expo-router";
import BackButton from "@/src/components/ui/BackButton";
import Theme from "@/src/theme/theme";
import { statusBarHeight, width, height } from "@/src/components/ui/Constants";

const palette = [
  Theme.colors.primary["500"],
  Theme.colors.primary["600"],
  Theme.colors.primary["700"],
  Theme.colors.primary["800"],
  Theme.colors.primary["900"],
];

// Pain Chart Component
const PainChart = ({ data }) => {
  if (!data || data.length === 0) {
    return; // <Text>Loading data...</Text>;
  }
  // Format data for VictoryChart
  const formattedData = data.map((d) => ({
    x: new Date(d.day), // Convert string to Date object
    y: d.pain_rating,
  }));
  // console.log("formatted data: ", formattedData);
  return (
    // <ScrollView horizontal showsHorizontalScrollIndicator={true}>
    <View style={styles.container}>
      <View style={styles.chartContainer}>
        <Text style={styles.title}>Highest Pain Severity Over Time</Text>
        <VictoryChart
          theme={VictoryTheme.clean}
          scale={{ x: "time" }}
          width={width * 0.85}
          padding={{ top: 20, bottom: 65, left: 60, right: 50 }}
        >
          <VictoryAxis
            style={{
              axis: { stroke: Theme.colors.darkBlue },
              ticks: { stroke: Theme.colors.darkBlue },
              tickLabels: {
                fill: Theme.colors.darkBlue,
                fontWeight: "bold",
                angle: -45,
                textAnchor: "end",
              },
              axisLabel: {
                fill: Theme.colors.darkBlue,
                fontFamily: Theme.typography.fonts.regular,
                padding: 50,
              },
            }}
            label="Date"
            tickFormat={(t) =>
              new Date(t).toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
              })
            }
          />
          <VictoryAxis
            dependentAxis
            style={{
              axis: { stroke: Theme.colors.darkBlue }, // Changes the axis line color
              ticks: { stroke: Theme.colors.darkBlue },
              tickLabels: {
                fill: Theme.colors.darkBlue,
                fontFamily: Theme.typography.fonts.regular,
              },
              axisLabel: {
                fill: Theme.colors.darkBlue,
                fontFamily: Theme.typography.fonts.regular,
              },
            }}
            label="Pain Rating"
          />
          <VictoryLine
            data={formattedData}
            style={{ data: { stroke: Theme.colors.darkPurple } }}
          />
        </VictoryChart>
      </View>
    </View>
    // </ScrollView>
  );
};

// Pie chart component
const PieChart = ({ data, title }) => {
  if (!data || Object.keys(data).length === 0) {
    return; // <Text>Loading data...</Text>;
  }
  // if (Object.keys(data).length > 5) {
  //   return <BarChart data={data} title={title} />;
  // }

  // Convert JSON object into an array format that VictoryPie understands
  let formattedData = Object.entries(data).map(([key, value]) => ({
    x: key, // JSON key as x (label)
    y: value, // JSON value as y (numeric data)
  }));
  formattedData = formattedData.sort((a, b) => a.y - b.y);

  // console.log("Pie chart formatted data: ", formattedData);
  return (
    <View style={styles.chartContainer}>
      <Text style={styles.title}> Most Common {title} </Text>
      <VictoryPie
        data={formattedData}
        // colorScale={["#4CAF50", "#FF9800", "#2196F3", "#E91E63", "#9C27B0"]}
        colorScale={palette}
        labelRadius={90}
        labels={({ datum }) => `${datum.x}: ${datum.y}`} // Display both key and value
        style={{
          labels: { fill: "white", fontSize: 14 },
        }}
        labelComponent={
          <VictoryLabel
            text={({ datum }) => `${datum.x}: ${datum.y}`}
            style={{ fill: "white", fontSize: 14 }}
            textAnchor="middle"
            lineHeight={1.2}
            dx={0}
            dy={0}
            angle={-20}
          />
        }
        width={width - 20}
      />
    </View>
  );
};

const BarChart = ({ data, title }) => {
  if (!data || Object.keys(data).length === 0) {
    return; // <Text>Loading data...</Text>;
  }
  let formattedData = Object.entries(data).map(([key, value]) => ({
    x: key, // JSON key as x (label)
    y: value, // JSON value as y (numeric data)
  }));
  formattedData = formattedData.sort((a, b) => a.y - b.y); // limit to 6 
  console.log(formattedData);
  formattedData = formattedData.slice(-6); 

  const lenFirstKey = formattedData[formattedData.length-1]["x"].length;
  // console.log(lenFirstKey);
  const rightPad = 40 + 2 * lenFirstKey;
  const minChartHeight = 200; // Prevents charts from being too small
  const maxChartHeight = height * 0.7; // Prevents overly tall charts
  const chartHeight = Math.min(
    maxChartHeight,
    Math.max(minChartHeight, formattedData.length * 30 + 70)
  );
  const barWidth = Math.min(20, chartHeight / (formattedData.length * 1.5));

  return (
    <View style={styles.chartContainer}>
      <Text style={styles.title}> Most Common {title} </Text>
      <VictoryChart
        theme={VictoryTheme.clean}
        domainPadding={{ x: 20, y: 15 }}
        width={width - 20}
        height={chartHeight}
        padding={{ top: 10, bottom: 50, left: 40, right: rightPad }}
      >
        {/* X-axis */}
        <VictoryAxis
          style={{
            axis: { stroke: Theme.colors.darkBlue }, // Changes the axis line color
            ticks: { stroke: Theme.colors.darkBlue }, // Changes tick color
            tickLabels: {
              fill: "transparent",
              fontWeight: "bold",
              fontSize: 12,
              angle: -15, // Rotates the labels slightly for better fit
              padding: 5,
            },
          }}
        />

        {/* Y-axis */}
        <VictoryAxis
          dependentAxis
          domain={[0, Math.max(...formattedData.map((d) => d.y))]}
          tickValues={Array.from(
            { length: Math.ceil(Math.max(...formattedData.map((d) => d.y))) },
            (_, i) => i + 1
          )}
          style={{
            axis: { stroke: Theme.colors.darkBlue }, // Changes the axis line color
            ticks: { stroke: "transparent" }, // Changes tick color
            tickLabels: {
              fill: Theme.colors.darkBlue,
              fontWeight: "bold",
              fontSize: 14,
            },
            axisLabel: {
              fill: Theme.colors.darkBlue,
              fontFamily: Theme.typography.fonts.regular,
            },
          }}
          label="Symptom Count"
        />

        {/* Bar chart */}
        <VictoryBar
          data={formattedData}
          barWidth={barWidth}
          horizontal={true}
          labels={({ datum }) => datum.x}
          labelComponent={
            <VictoryLabel
              textAnchor="start" // Center text inside the bars
              dx={3} // Keep text centered
              dy={0} // Adjust for better vertical alignment
              style={{
                fill: "black", // Ensure visibility inside bars
                fontSize: 12,
                fontWeight: "normal",
              }}
            />
          }
          style={{
            data: {
              fillOpacity: 1,
              strokeWidth: 0,
              fill: ({ index }) => palette[index % palette.length], // Cycle through colors
            },
          }}
        />
      </VictoryChart>
    </View>
  );
};

// Parent Component: Fetch Data and Pass to PainChart
const PlotDisplayer = () => {
  const [pain_data, setPainData] = useState([]);
  const [count_data, setCountData] = useState([]);
  const router = useRouter();

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
    <ImageBackground
      source={require("@/assets/background.png")}
      resizeMode="cover"
      style={styles.background}
    >
      <BackButton
        onPress={() => {
          router.back();
        }}
        showArrow={true}
      />

      <View style={styles.header}>
        <Text style={styles.cardTitle}>Your Health Plots</Text>
      </View>
      <ScrollView contentContainerStyle={{ paddingBottom: 200 }}>
        <View style={styles.container}>
          <PainChart data={pain_data} />

          <BarChart data={count_data.symptoms} title="Symptoms" />

          <BarChart data={count_data.duration} title="Durations" />

          <BarChart data={count_data["when-does-it-hurt"]} title="Timings" />

          <BarChart data={count_data["context"]} title="Context" />

          <PieChart data={count_data["sensation"]} title="Sensations" />
        </View>
      </ScrollView>
    </ImageBackground>
  );
};

export default PlotDisplayer;

const styles = StyleSheet.create({
  header: {
    marginTop: statusBarHeight,
    flexDirection: "row",
    justifyContent: "center",
    paddingVertical: 16,
  },
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  scrollView: {
    flex: 1,
  },
  chartContainer: {
    backgroundColor: Theme.colors.white,
    width: width * 0.85,
    borderRadius: Theme.radius.md,
    marginBottom: Theme.spacing.md,
    alignItems: "center",
    paddingBottom: Theme.spacing.md,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    margin: Theme.spacing.md,
    marginBottom: 0,
    textAlign: "center",
  },
  cardTitle: {
    fontSize: Theme.typography.sizes.xl,
    color: "white",
    fontWeight: "bold",
    fontFamily: Theme.typography.fonts.bold,
    marginBottom: Theme.spacing.sm,
  },
});
