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

export default function LoadingWorstPainBlob({ style, size = 200 }) {
  const scale = size / 237; // Original SVG width is 237
  const translateX = useSharedValue(0);
  const scaleAnim = useSharedValue(1);
  const rotateAnim = useSharedValue('0deg');

  useEffect(() => {
    // Erratic horizontal movement
    translateX.value = withRepeat(
      withSequence(
        withSpring(-20, {
          damping: 1.5, // Lower damping for more bounce
          stiffness: 150, // Higher stiffness for quicker movement
          velocity: 20, // Initial velocity for more erratic movement
        }),
        withSpring(20, {
          damping: 1.5,
          stiffness: 150,
          velocity: -20,
        }),
        withSpring(0, {
          damping: 1.5,
          stiffness: 150,
        })
      ),
      -1,
      true
    );

    // More dramatic breathing animation
    scaleAnim.value = withRepeat(
      withSequence(
        withTiming(1.08, {
          duration: 600, // Faster scaling
          easing: Easing.bezier(0.25, 0.1, 0.25, 1),
        }),
        withTiming(0.95, {
          duration: 600,
          easing: Easing.bezier(0.25, 0.1, 0.25, 1),
        })
      ),
      -1,
      true
    );

    // More pronounced rotation
    rotateAnim.value = withRepeat(
      withSequence(
        withTiming('8deg', {
          duration: 800,
          easing: Easing.bezier(0.25, 0.1, 0.25, 1),
        }),
        withTiming('-8deg', {
          duration: 800,
          easing: Easing.bezier(0.25, 0.1, 0.25, 1),
        })
      ),
      -1,
      true
    );
  }, []);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      { translateX: translateX.value },
      { scale: scaleAnim.value },
      { rotate: rotateAnim.value }
    ],
  }));

  return (
    <View style={[styles.container, style]}>
      <Animated.View style={animatedStyle}>
        <Svg width={237 * scale} height={327 * scale} viewBox="0 0 237 327" fill="none">
          <Defs>
            <LinearGradient id="paint0_linear_166_10" x1="128.106" y1="41.6855" x2="240.708" y2="238.82" gradientUnits="userSpaceOnUse">
              <Stop stopColor="#A2D0E4" />
              <Stop offset="0.655" stopColor="#7089E6" />
              <Stop offset="1" stopColor="#9997E1" />
            </LinearGradient>
          </Defs>
          <Path
            d="M105.826 0.299863C164.137 -4.79522 138.46 56.4149 183.326 79.2999C197.337 86.4461 224.327 74.7999 233.827 105.8C249.123 155.711 204.525 168.05 195.827 195.8C183.18 236.149 250.756 248.956 224.327 278.8C188.326 319.452 162.973 244.709 140.826 248.3C107.326 253.732 131.326 331.95 74.8265 326.3C41.6359 322.981 56.0967 245.487 53.8266 213.3C52.1836 190.004 -12.9788 184.3 2.32639 138.8C20.8272 83.8001 53.3819 107.099 58.3272 89.2998C63.461 70.8219 54.3264 4.79989 105.826 0.299863Z"
            fill="url(#paint0_linear_166_10)"
          />
          <Path
            d="M76.2466 95.7621L89.9908 92.7372"
            stroke="black"
            strokeWidth="10"
            strokeLinecap="round"
          />
          <Path
            d="M81.3274 121.671L103.827 129.3L81.3274 146.3"
            stroke="black"
            strokeWidth="10"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <Path
            d="M165.071 91.8907L176.525 95.0977"
            stroke="black"
            strokeWidth="10"
            strokeLinecap="round"
          />
          <Path
            d="M173.327 121.171L150.827 128.8L173.327 145.8"
            stroke="black"
            strokeWidth="10"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <Path
            d="M158.768 194.964C138.3 191.541 141.264 191.585 124.103 191.331C109.339 191.113 110.545 191.131 89.985 193.947"
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