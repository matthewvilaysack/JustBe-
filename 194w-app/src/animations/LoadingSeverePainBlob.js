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

export default function LoadingSeverePainBlob({ style, size = 200 }) {
  const scale = size / 197; // Original SVG width is 197
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
        <Svg width={197 * scale} height={283 * scale} viewBox="0 0 197 283" fill="none">
          <Defs>
            <LinearGradient id="paint0_linear_97_122" x1="109.573" y1="3.6855" x2="222.176" y2="200.821" gradientUnits="userSpaceOnUse">
              <Stop stopColor="#A2D0E4" />
              <Stop offset="0.655" stopColor="#7089E6" />
              <Stop offset="1" stopColor="#9997E1" />
            </LinearGradient>
          </Defs>
          <Path
            d="M18.3686 143.681C42.5056 92.9928 -7.5693 60.9727 28.558 30.9905C79.2534 -11.0817 113.497 -3.51045 158.364 19.3745C203.23 42.2594 200.195 103.331 187.548 143.681C174.901 184.031 213.977 228.489 187.548 258.332C167.093 281.43 78.3284 283.759 53.3676 281.263C-3.84477 275.542 -12.4973 208.5 18.3686 143.681Z"
            fill="url(#paint0_linear_97_122)"
          />
          <Path
            d="M98.6801 96.2338C98.6801 131.218 83.149 136.78 69.4845 136.78C45.2612 136.78 35.9481 120.74 33.4635 106.927C30.9789 93.1148 39.0522 59.5894 58.9285 56.1327C81.9067 52.1364 98.6801 75.2924 98.6801 96.2338Z"
            fill="white"
          />
          <Circle cx="68.1198" cy="96.5645" r="21.5757" fill="black" />
          <Path d="M57.7122 57.7622L71.4564 54.7373" stroke="black" strokeWidth="10" strokeLinecap="round" />
          <Path
            d="M179.708 105.964C179.708 139.686 149.777 138.017 139.177 136.027C115.713 131.624 117.976 111.705 117.976 94.955C117.976 78.2052 129.827 54.5838 149.781 55.8722C173.373 57.3956 179.708 85.7782 179.708 105.964Z"
            fill="white"
          />
          <Circle cx="145.285" cy="96.7071" r="21.5757" fill="black" />
          <Path d="M146.537 53.8907L157.991 57.0977" stroke="black" strokeWidth="10" strokeLinecap="round" />
          <Path
            d="M140.234 156.964C119.766 153.541 122.73 153.585 105.568 153.331C90.8043 153.113 92.0111 153.131 71.4506 155.947"
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