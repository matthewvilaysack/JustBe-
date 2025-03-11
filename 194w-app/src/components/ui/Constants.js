import { Dimensions, Platform, StatusBar } from "react-native";
import Constants from "expo-constants";

export const statusBarHeight =
  Platform.OS === "android"
    ? StatusBar.currentHeight
    : Constants.statusBarHeight;
export const { width, height } = Dimensions.get("window");

export default {
  statusBarHeight,
  width,
  height,
};
