import React from "react";
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  ViewStyle,
  TextStyle,
  View,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import theme from "@/src/theme/theme";

interface SelectionButtonProps {
  title: string;
  onPress: () => void;
  selected?: boolean;
  style?: ViewStyle;
  textStyle?: TextStyle;
}

export default function SelectionButton({
  title,
  onPress,
  selected,
  style,
  textStyle,
}: SelectionButtonProps) {
  return (
    <TouchableOpacity onPress={onPress} style={[styles.buttonContainer, style]}>
      {selected ? (
        <View style={[styles.gradient, styles.selected]}>
          <Text style={[styles.text, { color: theme.colors.primary[400] }]}>
            {title}
          </Text>
        </View>
      ) : (
        <LinearGradient
          colors={["#85ABE0", "#5671DA", "#8189DE"]}
          locations={[0, 0.52, 1]}
          start={{ x: 0, y: 0 }}
          end={{ x: 0, y: 1 }}
          style={styles.gradient}
        >
          <Text style={styles.text}>{title}</Text>
        </LinearGradient>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  buttonContainer: {
    shadowColor: "#344A66",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 4,
  },
  gradient: {
    width: "100%",
    height: "100%",
    borderRadius: 50,
    borderColor: "white",
    borderWidth: 0.3,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: theme.spacing.sm,
  },
  selected: {
    backgroundColor: theme.colors.white,
  },
  text: {
    fontFamily: "Lexend_400Regular",
    fontSize: theme.typography.sizes.lg,
    lineHeight: 20,
    textAlign: "center",
    color: "#FFFFFF",
    fontWeight: "bold",
  },
});
