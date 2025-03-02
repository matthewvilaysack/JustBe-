import React from "react";
import { View } from "react-native";
import { VictoryChart, VictoryLine, VictoryAxis } from "victory-native";
import { getHighestPainRatingPerDay } from "../../utils/supabase-helpers";

const HighestSeverityPerDayGraph = async () => {
  // Sample data
  // const data = [
  //   { x: new Date(2024, 0, 1), y: 10 },
  //   { x: new Date(2024, 0, 5), y: 25 },
  //   { x: new Date(2024, 0, 10), y: 15 },
  //   { x: new Date(2024, 0, 15), y: 30 },
  //   { x: new Date(2024, 0, 20), y: 20 }
  // ];
  const pain_data = await getHighestPainRatingPerDay();
  const formattedData = pain_data.map(d => ({
    x: new Date(d.day),  // Convert date string to Date object
    y: d.pain_rating
  }));
  console.log(pain_data);
  return (
    <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
      <VictoryChart> 
        <VictoryAxis 
          tickValues={formattedData.map((d) => d.x)}
          tickFormat={(t) => `${t.getMonth() + 1}/${t.getDate()}/${t.getDate()}`} 
          style={{ tickLabels: { fontSize: 12, angle: -30 } }}
        />
        <VictoryAxis dependentAxis />
        <VictoryLine data={formattedData} />
      </VictoryChart>
    </View>
  );
};
export default HighestSeverityPerDayGraph;
