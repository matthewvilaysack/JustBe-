import React, { useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import Svg, { Path, Circle, LinearGradient, Stop, Defs } from 'react-native-svg';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withSpring,
  withSequence,
  Easing,
  withTiming,
} from 'react-native-reanimated';

export default function LoadingModerateBlob({ style, size = 200 }) {
  const scale = size / 229; // Original SVG width is 229
  const translateY = useSharedValue(0);
  const scaleAnim = useSharedValue(1);

  useEffect(() => {
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
    scaleAnim.value = withRepeat(
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
    transform: [
      { translateY: translateY.value },
      { scale: scaleAnim.value }
    ],
  }));

  return (
    <View style={[styles.container, style]}>
      <Animated.View style={animatedStyle}>
        <Svg width={229 * scale} height={282 * scale} viewBox="0 0 229 282" fill="none">
          <Defs>
            <LinearGradient id="paint0_linear_187_9" x1="129.78" y1="2.88568" x2="242.383" y2="200.021" gradientUnits="userSpaceOnUse">
              <Stop stopColor="#A2D0E4" />
              <Stop offset="0.655" stopColor="#7089E6" />
              <Stop offset="1" stopColor="#9997E1" />
            </LinearGradient>
          </Defs>
          <Path
            d="M12.5 150.5C36.637 99.8117 12.6377 60.1728 48.765 30.1907C99.4604 -11.8815 133.705 -4.31025 178.571 18.5747C223.438 41.4596 236.147 110.15 223.5 150.5C210.853 190.85 234.184 227.689 207.755 257.533C187.3 280.63 98.5355 282.959 73.5746 280.463C16.3622 274.742 -18.3659 215.319 12.5 150.5Z"
            fill="url(#paint0_linear_187_9)"
          />
          <Path
            d="M118.887 95.434C118.887 130.418 103.356 135.98 89.6917 135.98C65.4683 135.98 56.1553 119.94 53.6707 106.128C51.186 92.315 59.2594 58.7896 79.1357 55.3329C102.114 51.3366 118.887 74.4926 118.887 95.434Z"
            fill="white"
          />
          <Circle cx="88.327" cy="95.7647" r="21.5757" fill="black" />
          <Path d="M77.9194 56.9624L91.6636 53.9375" stroke="black" strokeWidth="10" strokeLinecap="round" />
          <Path
            d="M199.915 105.164C199.915 138.886 169.984 137.217 159.384 135.228C135.921 130.824 138.183 110.905 138.183 94.1552C138.183 77.4054 150.034 53.784 169.988 55.0724C193.58 56.5958 199.915 84.9784 199.915 105.164Z"
            fill="white"
          />
          <Circle cx="165.493" cy="95.9073" r="21.5757" fill="black" />
          <Path d="M166.744 53.0909L178.198 56.2979" stroke="black" strokeWidth="10" strokeLinecap="round" />
          <Path
            d="M160.441 152.028C139.973 155.451 142.937 155.407 125.775 155.661C111.012 155.879 112.218 155.861 91.6578 153.045"
            stroke="black"
            strokeWidth="10"
            strokeLinecap="round"
          />
        </Svg>
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