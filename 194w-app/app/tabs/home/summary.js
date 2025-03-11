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
import { useRouter } from "expo-router";
import Theme from "@/src/theme/theme";
import NextButton from "@/src/components/ui/NextButton";
import BackButton from "@/src/components/ui/BackButton";
import { useKeywordStore } from "@/src/store/summaryStore";

const { width, height } = Dimensions.get("window");
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

  return (
    <ImageBackground
      source={require("@/assets/background.png")}
      resizeMode="cover"
      style={styles.background}
    >
      <View style={styles.buttonContainer}>
        <BackButton
          onPress={() => {
            router.back();
          }}
          showArrow={true}
        />
      </View>
      <View style={styles.container}>
        <Text style={styles.heading}>I hear you're feeling</Text>
        <View style={styles.journalContainer}>
          {keywords.map((word, index) => {
            const opacity = animations[index];

            const leftOffset = index % 2 === 0 ? -width / 3 : 0;
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
                <View style={styles.symptomContainer}>
                  <Text style={styles.symptomText}>{word}</Text>
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
    padding: Theme.spacing.xl,
  },
  heading: {
    fontSize: Theme.typography.sizes.xl,
    color: Theme.colors.white,
    textAlign: "center",
    marginBottom: Theme.spacing.lg,
    fontFamily: Theme.typography.fonts.bold,
  },
  symptomContainer: {
    backgroundColor: Theme.colors.white,
    padding: 10,
    borderRadius: Theme.radius.lg,
    alignSelf: "flex-start",
  },
  symptomText: {
    fontSize: Theme.typography.sizes.sm,
    color: Theme.colors.darkGray,
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
    top: "7%",
    left: "3%",
    //opacity: 0.8,
  },
  footer: {
    flexDirection: "row",
    justifyContent: "flex-end",
    paddingBottom: Theme.spacing.lg,
    paddingLeft: Theme.spacing.lg,
    paddingRight: Theme.spacing.lg,
  },
});
