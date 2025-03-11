import React, { useState, useEffect, useRef } from "react";
import {
  StyleSheet,
  View,
  ImageBackground,
  Text,
  ScrollView,
  Animated,
} from "react-native";
import { useRouter } from "expo-router";
import Theme from "@/src/theme/theme";
import NextButton from "@/src/components/ui/NextButton";
import BackButton from "@/src/components/ui/BackButton";
import { useKeywordStore } from "@/src/store/summaryStore";
import { width, height, statusBarHeight } from "@/src/components/ui/Constants";

export default function Page() {
  const { keywords } = useKeywordStore();
  const router = useRouter();
  const [animations, setAnimations] = useState([]);

  useEffect(() => {
    const newAnimations = keywords.map(() => new Animated.Value(0));
    setAnimations(newAnimations);

    if (newAnimations.length > 0) {
      Animated.stagger(
        500,
        newAnimations.map((anim) =>
          Animated.timing(anim, {
            toValue: 1,
            duration: 1000,
            useNativeDriver: true,
          })
        )
      ).start();
    }
  }, [keywords]);

  const getFontSize = (word) => {
    if (word.length <= 20) return Theme.typography.sizes.lg;

    if (word.length <= 30) return Theme.typography.sizes.md;
    return Theme.typography.sizes.sm;
  };

  return (
    <ImageBackground
      source={require("@/assets/background.png")}
      resizeMode="cover"
      style={styles.background}
    >
      <BackButton
        onPress={() => {
          router.back();
        }}
        showArrow={true}
      />
      <View style={styles.container}>
        <Text style={styles.heading}>I hear you're feeling</Text>
        <View style={styles.listContainer}>
          {keywords.map((word, index) => {
            const opacity = animations[index];

            const leftOffset = index % 2 === 0 ? -width / 2 + 100 : -20;
            const left = Math.min(width / 2 + leftOffset, width - 100);
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
                <View
                  style={[
                    styles.symptomContainer,
                    {
                      height: height / keywords.length,
                      maxHeight: Theme.spacing.lg * 2,
                    },
                  ]}
                >
                  <Text
                    style={[
                      styles.symptomText,
                      { fontSize: getFontSize(word) },
                    ]}
                  >
                    {word}
                  </Text>
                </View>
              </Animated.View>
            );
          })}
        </View>
      </View>
      <View style={styles.footer}>
        <NextButton
          onPress={() => router.push("/tabs/home/confirm")}
          showArrow={true}
        />
      </View>
    </ImageBackground>
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
    padding: Theme.spacing.sm,
    marginTop: statusBarHeight + Theme.spacing.xl,
  },
  heading: {
    fontSize: Theme.typography.sizes.xl,
    color: Theme.colors.white,
    textAlign: "center",
    marginBottom: Theme.spacing.lg,
    fontFamily: Theme.typography.fonts.bold,
  },
  symptomContainer: {
    justifyContent: "center",
    backgroundColor: Theme.colors.white,
    opacity: 0.95,
    paddingHorizontal: 15,
    borderRadius: Theme.radius.pill,
    alignSelf: "flex-start",
  },
  symptomText: {
    color: Theme.colors.darkGray,
    fontFamily: Theme.typography.fonts.bold,
    flexWrap: "wrap",
  },
  listContainer: {
    minWidth: width,
  },
  scrollContent: {},
  footer: {
    flexDirection: "row",
    justifyContent: "flex-end",
    paddingBottom: Theme.spacing.lg,
    paddingLeft: Theme.spacing.lg,
    paddingRight: Theme.spacing.lg,
  },
});
