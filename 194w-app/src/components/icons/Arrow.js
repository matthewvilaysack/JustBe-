import * as React from "react";
import Svg, { Line } from "react-native-svg";
import Theme from "@/src/theme/theme";

const ARROW_WIDTH = Theme.components.arrow.width;
const ARROW_HEIGHT = Theme.components.arrow.height;

export default function Arrow({ 
  width = ARROW_WIDTH,
  height = ARROW_HEIGHT,
  color = Theme.colors.button.primary.border,
  style,
  ...props 
}) {
  return (
    <Svg
      width={width}
      height={height}
      viewBox={`0 0 ${width} ${height}`}
      style={[
        {
          transform: [{ rotate: `${Theme.components.arrow.rotation}deg` }],
          ...Theme.components.arrow.shadow,
        },
        style,
      ]}
      {...props}
    >
      <Line
        x1="0"
        y1={height/2}
        x2={width}
        y2={height/2}
        stroke={color}
        strokeWidth={height}
        strokeLinecap="round"
      />
    </Svg>
  );
} 