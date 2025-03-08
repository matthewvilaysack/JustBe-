import * as React from "react";
import { Dimensions } from "react-native";
import Theme from "@/src/theme/theme";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";

const { width } = Dimensions.get("window");
const BUTTON_WIDTH = width * 0.1;

export default function ArrowRight() {
  return (
    <MaterialCommunityIcons
      size={BUTTON_WIDTH}
      name="arrow-right"
      color={Theme.colors.button.primary.border}
    />
  );
}
