import React, { useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import Svg, { Path, LinearGradient, Stop, Defs } from 'react-native-svg';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withSpring,
  withSequence,
  Easing,
  withTiming,
} from 'react-native-reanimated';

export default function LoadingVerySeverePainBlob({ style, size = 200 }) {
  const scale = size / 238; // Original SVG width is 238
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
        <Svg width={238 * scale} height={284 * scale} viewBox="0 0 238 284" fill="none">
          <Defs>
            <LinearGradient id="paint0_linear_187_21" x1="122.78" y1="1.88567" x2="235.383" y2="199.021" gradientUnits="userSpaceOnUse">
              <Stop stopColor="#A2D0E4" />
              <Stop offset="0.655" stopColor="#7089E6" />
              <Stop offset="1" stopColor="#9997E1" />
            </LinearGradient>
          </Defs>
          <Path
            d="M14.5001 141.881C57.3056 88.6387 8.37277 44.9822 44.5001 15C95.1955 -27.0722 114.634 34.5003 165 34.5003C185 34.5003 215.605 7.50004 232.5 52C251.864 103 208.986 115.618 200.755 141.881C188.108 182.231 257 218 206.5 257.5C177.986 279.803 170.36 250.035 141.5 253C111.791 256.052 115.5 296.5 66.5742 279.463C44.8472 271.897 57.9171 242.424 49.5001 222C36.8816 191.38 -27 193.5 14.5001 141.881Z"
            fill="url(#paint0_linear_187_21)"
          />
          <Path
            d="M111.887 94.4341C111.887 129.419 96.3558 134.98 82.6913 134.98C58.468 134.98 49.1549 118.94 46.6703 105.128C44.1857 91.3151 61.6777 87.3028 80.9998 81.5C104.308 74.5001 111.887 73.4927 111.887 94.4341Z"
            fill="white"
          />
          <Path
            d="M102.902 94.7647C102.902 106.681 93.2425 116.34 81.3266 116.34C69.4107 116.34 59.751 106.681 59.751 94.7647C59.751 86.5 56.4998 89.5 79.9998 82C103.5 74.5 102.902 74.4999 102.902 94.7647Z"
            fill="black"
          />
          <Path
            d="M68.9998 71.8715L82.7439 68.8466"
            stroke="black"
            strokeWidth="10"
            strokeLinecap="round"
          />
          <Path
            d="M125.655 97.5413C127.979 130.734 144.401 135.063 158.524 134.23C183.562 132.753 192.122 116.967 193.772 103.71C195.423 90.4538 177.077 87.7137 156.72 83.3864C132.164 78.1664 124.263 77.6728 125.655 97.5413Z"
            fill="white"
          />
          <Path
            d="M134.963 97.3072C135.755 108.613 146.381 117.189 158.697 116.462C171.013 115.735 180.356 105.981 179.564 94.6759C179.015 86.8346 182.575 89.4827 157.787 83.7999C132.999 78.1171 133.617 78.0805 134.963 97.3072Z"
            fill="black"
          />
          <Path
            d="M169 68.1436L153.056 68.1436"
            stroke="black"
            strokeWidth="10"
            strokeLinecap="round"
          />
          <Path
            d="M153.441 155.164C132.973 151.741 135.937 151.785 118.775 151.531C104.011 151.313 105.218 151.331 84.6575 154.147"
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