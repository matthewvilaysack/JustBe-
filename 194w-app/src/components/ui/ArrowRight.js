import * as React from "react";
import Svg, { Line } from "react-native-svg";
import Theme from "@/src/theme/theme";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";

const BUTTON_HEIGHT = 72.08;

export default function ArrowRight() {
  return (
    <MaterialCommunityIcons
      size={BUTTON_HEIGHT * 0.5}
      name="arrow-right"
      color={Theme.colors.button.primary.border}
    />
  );
}
