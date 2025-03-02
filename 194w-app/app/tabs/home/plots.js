import React from "react";
import { View } from "react-native";
import { VictoryChart, VictoryLine, VictoryAxis } from "victory-native";
const HighestSeverityPerDayGraph = () => {
  // Sample data
  const data = [
    { x: new Date(2024, 0, 1), y: 10 },
    { x: new Date(2024, 0, 5), y: 25 },
    { x: new Date(2024, 0, 10), y: 15 },
    { x: new Date(2024, 0, 15), y: 30 },
    { x: new Date(2024, 0, 20), y: 20 }
  ];
  return (
    <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
      <VictoryChart> 
        <VictoryAxis 
          tickValues={data.map((d) => d.x)}
          tickFormat={(t) => `${t.getMonth() + 1}/${t.getDate()}`} 
          style={{ tickLabels: { fontSize: 12, angle: -30 } }}
        />
        <VictoryAxis dependentAxis />
        <VictoryLine data={data} />
      </VictoryChart>
    </View>
  );
};
export default HighestSeverityPerDayGraph;
