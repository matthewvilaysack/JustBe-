import {
  TouchableOpacity,
  StyleSheet,
  Text,
  View,
  StatusBar,
} from "react-native";
import Theme from "@/src/theme/theme";
import ArrowLeft from "./ArrowLeft";
import Constants from "expo-constants";

const statusBarHeight = Constants.statusBarHeight;

export default function BackButton({
  title,
  onPress,
  variant = "primary", // primary or secondary
  disabled = false,
  showArrow = false,
  style,
}) {
  return (
    <View style={styles.buttonContainer}>
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
    </View>
  );
}

const styles = StyleSheet.create({
  buttonContainer: {
    position: "absolute",
    top: StatusBar.currentHeight || statusBarHeight,
    left: 20,
    opacity: 0.9,
    zIndex: 10,
    alignSelf: "flex-start",
  },
  button: {
    paddingHorizontal: 10,
    paddingVertical: 10,
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
