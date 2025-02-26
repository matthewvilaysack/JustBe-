import { TouchableOpacity, StyleSheet, Text, View } from "react-native";
import Theme from "@/src/theme/theme";
import ArrowLeft from "./ArrowLeft";

export default function Button({
  title,
  onPress,
  variant = "primary", // primary or secondary
  disabled = false,
  showArrow = false,
  style,
}) {
  return (
    <TouchableOpacity
      style={[
        styles.button,
        variant === "secondary" && styles.buttonSecondary,
        disabled && styles.buttonDisabled,
        style,
      ]}
      onPress={onPress}
      disabled={disabled}
    >
      {/* Text Button */}
      {!showArrow && (
        <Text
          style={[
            styles.text,
            variant === "secondary" && styles.textSecondary,
            disabled && styles.textDisabled,
          ]}
        >
          {title}
        </Text>
      )}

      {showArrow && <ArrowLeft />}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    paddingHorizontal: 25,
    paddingVertical: 15,
    backgroundColor: Theme.colors.white,
    borderRadius: Theme.radius.pill,
    alignItems: "center",
    justifyContent: "center",
    ...Theme.shadows.button,
  },
  buttonSecondary: {
    backgroundColor: Theme.colors.white,
  },
  buttonDisabled: {
    opacity: 0.5,
  },
  text: {
    color: Theme.colors.text.primary,
    fontSize: Theme.typography.sizes.xl,
    fontFamily: Theme.typography.fonts.regular,
    lineHeight: 30,
  },
  textSecondary: {
    color: Theme.colors.button.primary.text,
  },
  textDisabled: {
    opacity: 0.5,
  },
});
