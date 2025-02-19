import React from "react";
import { View, StyleSheet } from "react-native";
import Animated, {
  useAnimatedStyle,
  withRepeat,
  withSequence,
  useSharedValue,
  withSpring,
  withTiming,
  Easing,
} from "react-native-reanimated";
import Blob from "@/src/components/ui/Blob";

interface LoadingBlobProps {
  style?: any;
}

export default function LoadingBlob({ style }: LoadingBlobProps) {
  const scale = useSharedValue(1);
  const translateY = useSharedValue(0);

  React.useEffect(() => {
    // Bouncing animation
    translateY.value = withRepeat(
      withSequence(
        withSpring(-10, {
          damping: 3,
          stiffness: 100,
        }),
        withSpring(0, {
          damping: 3,
          stiffness: 100,
        })
      ),
      -1,
      true
    );

    // Subtle breathing animation
    scale.value = withRepeat(
      withSequence(
        withTiming(1.05, {
          duration: 1000,
          easing: Easing.bezier(0.25, 0.1, 0.25, 1),
        }),
        withTiming(1, {
          duration: 1000,
          easing: Easing.bezier(0.25, 0.1, 0.25, 1),
        })
      ),
      -1,
      true
    );
  }, []);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }, { translateY: translateY.value }],
  }));

  return (
    <View style={[styles.container, style]}>
      <Animated.View style={animatedStyle}>
        <Blob size={200} />
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    justifyContent: "center",
  },
});
