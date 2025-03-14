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

export default function LoadingNoPainBlob({ style, size = 200 }) {
  const scale = size / 282; // Original SVG width is 282
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
        <Svg width={282 * scale} height={232 * scale} viewBox="0 0 282 232" fill="none">
          <Defs>
            <LinearGradient id="paint0_linear_97_97" x1="140.687" y1="0" x2="253.29" y2="197.135" gradientUnits="userSpaceOnUse">
              <Stop stopColor="#A2D0E4" />
              <Stop offset="0.655" stopColor="#7089E6" />
              <Stop offset="1" stopColor="#9997E1" />
            </LinearGradient>
          </Defs>
          <Path
            d="M0.652073 136.008C6.91532 78.9165 23.5438 57.2871 59.6711 27.3049C110.366 -14.7673 173.795 -1.30122 218.661 21.5837C263.528 44.4686 290.929 116.737 278.282 157.087C265.635 197.436 171.386 236.883 114.173 231.162C56.961 225.44 -7.17698 207.373 0.652073 136.008Z"
            fill="url(#paint0_linear_97_97)"
          />
          <Path
            d="M129.793 92.5482C129.793 127.533 114.262 133.094 100.597 133.094C76.3738 133.094 67.0608 117.054 64.5762 103.242C62.0916 89.4293 70.1649 55.9039 90.0412 52.4471C113.019 48.4509 129.793 71.6069 129.793 92.5482Z"
            fill="white"
          />
          <Circle cx="99.2324" cy="92.879" r="21.5757" fill="black" />
          <Path d="M88.825 54.0768L102.569 51.0519" stroke="black" strokeWidth="10" strokeLinecap="round" />
          <Path
            d="M210.82 102.278C210.82 136 180.89 134.331 170.289 132.342C146.826 127.939 149.088 108.019 149.088 91.2696C149.088 74.5198 160.939 50.8983 180.893 52.1868C204.485 53.7102 210.82 82.0928 210.82 102.278Z"
            fill="white"
          />
          <Circle cx="176.398" cy="93.0216" r="21.5757" fill="black" />
          <Path d="M177.65 50.2053L189.103 53.4123" stroke="black" strokeWidth="10" strokeLinecap="round" />
          <Path
            d="M111.996 139.03C113.803 144.149 120.135 152.77 137.299 152.77C153.559 152.77 159.573 144.751 162.584 139.03"
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