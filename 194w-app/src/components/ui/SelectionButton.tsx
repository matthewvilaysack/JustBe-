/**
 * @file SelectionButton.tsx
 * @description A customizable button component used in the onboarding flow for selecting options.
 * Supports both regular selection buttons and a special "Other" option with text input.
 */

import React from "react";
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  ViewStyle,
  View,
  TextInput,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import theme from "@/src/theme/theme";

interface SelectionButtonProps {
  title: string;
  onPress: () => void;
  selected?: boolean;
  style?: ViewStyle;
  isOther?: boolean;
  customValue?: string;
  onCustomValueChange?: (text: string) => void;
}

export default function SelectionButton({
  title,
  onPress,
  selected,
  style,
  isOther,
  customValue,
  onCustomValueChange,
}: SelectionButtonProps) {
  return (
    <View style={[styles.wrapper, style]}>
      <TouchableOpacity onPress={onPress} style={styles.buttonContainer}>
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

      {isOther && selected && (
        <TextInput
          value={customValue}
          onChangeText={onCustomValueChange}
          placeholder="Type your condition..."
          placeholderTextColor={theme.colors.white + "60"}
          style={styles.input}
          autoFocus
          returnKeyType="done"
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    alignItems: "center",
    marginBottom: theme.spacing.sm,
  },
  buttonContainer: {
    width: "100%",
    height: 40,
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
  },
  selected: {
    backgroundColor: theme.colors.white,
  },
  text: {
    fontFamily: theme.typography.fonts.regular,
    fontSize: theme.typography.sizes.md,
    textAlign: "center",
    color: theme.colors.white,
    fontWeight: "bold",
  },
  input: {
    width: "100%",
    height: 40,
    backgroundColor: theme.colors.white + "20",
    borderRadius: theme.radius.pill,
    borderWidth: 1,
    borderColor: theme.colors.white + "40",
    marginTop: theme.spacing.md,
    color: theme.colors.white,
    fontSize: theme.typography.sizes.md,
    fontFamily: theme.typography.fonts.regular,
    textAlign: "center",
    paddingHorizontal: theme.spacing.md,
  },
});
