import React, { useState, useEffect, useRef } from "react";
import {
  StyleSheet,
  View,
  ImageBackground,
  Image,
  Text,
  Dimensions,
  TextInput,
  Keyboard,
  TouchableWithoutFeedback,
  Animated,
} from "react-native";
import Carousel from "react-native-reanimated-carousel";
import { useRouter } from "expo-router";
import Theme from "@/src/theme/theme";
import Button from "@/src/components/ui/Button";
import { extractKeywords } from "@/src/lib/api/togetherai";
const { width, height } = Dimensions.get("window");

const words = [
  "React",
  "Native",
  "Animation",
  "Cloud",
  "Expo",
  "UI",
  "Mobile",
  "JavaScript",
  "CSS",
  "Flexbox",
];

export default function Page() {
  const [text, setText] = useState("");
  const router = useRouter();
  const currentDate = new Date().toLocaleDateString();

  const animations = useRef(words.map(() => new Animated.Value(0))).current; // Array of animations

  useEffect(() => {
    // Animate each word one by one
    Animated.stagger(
      200, // Delay between animations
      animations.map((anim) =>
        Animated.timing(anim, {
          toValue: 1,
          duration: 600,
          useNativeDriver: true,
        })
      )
    ).start();
  }, []);

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
      <ImageBackground
        source={require("@/assets/background.png")}
        resizeMode="cover"
        style={styles.background}
      >
        <View style={styles.container}>
          <Text style={styles.heading}>I hear you're feeling</Text>
          <View style={styles.journalContainer}>
            {words.map((word, index) => {
              const opacity = animations[index];

              const leftOffset = index % 2 === 0 ? -120 : 80;
              const left = width / 2 + leftOffset;

              return (
                <Animated.View
                  key={index}
                  style={[
                    styles.word,
                    {
                      opacity,
                      top: index * 30 + 10,
                      left,
                    },
                  ]}
                >
                  <Text style={styles.wordText}>{word}</Text>
                </Animated.View>
              );
            })}
          </View>
        </View>
        <View style={styles.footer}>
          <Button
            onPress={() => router.push("/tabs/home/confirm")}
            showArrow={true}
          />
        </View>
      </ImageBackground>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
  },
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: Theme.spacing.xl,
  },
  heading: {
    fontSize: Theme.typography.sizes.xl,
    color: Theme.colors.white,
    textAlign: "center",
    marginBottom: Theme.spacing.lg,
    fontFamily: Theme.typography.fonts.bold,
  },
  dateText: {
    fontSize: Theme.typography.sizes.md,
    fontWeight: "bold",
    marginBottom: 5,
    color: Theme.colors.darkGray,
  },
  journalContainer: {
    minHeight: "50%",
    minWidth: width,
    borderRadius: Theme.radius.lg,
  },
  textArea: {
    fontSize: Theme.typography.sizes.xl,
    fontFamily: Theme.typography.fonts.bold,
  },
  buttonContainer: {
    position: "absolute",
    bottom: Theme.spacing.xxl,
    alignItems: "center",
    gap: Theme.spacing.xl,
  },
  footer: {
    flexDirection: "row",
    justifyContent: "flex-end",
    paddingBottom: Theme.spacing.lg,
    paddingRight: Theme.spacing.lg,
  },
});
