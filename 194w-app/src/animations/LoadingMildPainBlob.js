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

export default function LoadingMildPainBlob({ style, size = 200 }) {
  const scale = size / 253;
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
        <Svg width={253 * scale} height={256 * scale} viewBox="0 0 253 256" fill="none">
          <Defs>
            <LinearGradient id="paint0_linear_97_110" x1="123.687" y1="5.00001" x2="236.29" y2="202.135" gradientUnits="userSpaceOnUse">
              <Stop stopColor="#A2D0E4" />
              <Stop offset="0.655" stopColor="#7089E6" />
              <Stop offset="1" stopColor="#9997E1" />
            </LinearGradient>
          </Defs>
          <Path
            d="M1.00003 144C7.26328 86.9081 12.3727 61.9822 48.5 32C99.1953 -10.0722 146.633 -4.38491 191.5 18.5C236.367 41.3849 262.147 169.65 249.5 210C236.853 250.35 147.212 260.221 90 254.5C32.7877 248.779 -6.82902 215.365 1.00003 144Z"
            fill="url(#paint0_linear_97_110)"
          />
          <Path
            d="M112.793 97.5481C112.793 132.533 97.2614 138.094 83.5969 138.094C59.3736 138.094 50.0605 122.054 47.5759 108.242C45.0913 94.4292 53.1647 60.9037 73.0409 57.447C96.0192 53.4508 112.793 76.6068 112.793 97.5481Z"
            fill="white"
          />
          <Circle cx="82.232" cy="97.8789" r="21.5757" fill="black" />
          <Path d="M71.8245 59.0767L85.5686 56.0518" stroke="black" strokeWidth="10" strokeLinecap="round" />
          <Path
            d="M193.82 107.278C193.82 141 163.89 139.331 153.289 137.342C129.826 132.938 132.088 113.019 132.088 96.2695C132.088 79.5197 143.939 55.8982 163.893 57.1867C187.485 58.71 193.82 87.0926 193.82 107.278Z"
            fill="white"
          />
          <Circle cx="159.398" cy="98.0215" r="21.5757" fill="black" />
          <Path d="M160.65 55.2052L172.103 58.4122" stroke="black" strokeWidth="10" strokeLinecap="round" />
          <Path
            d="M85.9999 151.5C102.5 159.5 113 159.5 120.5 159.5C128 159.5 140.5 159.5 155.5 151.5"
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
