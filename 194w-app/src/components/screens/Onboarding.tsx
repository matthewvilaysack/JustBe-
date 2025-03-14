/**
 * @file Onboarding.tsx
 * @description Onboarding flow component that guides new users through initial setup,
 * collecting information about their pain type and duration. Uses a slide-based
 * interface with animated transitions.
 */

import React, { useState, useRef, useEffect } from "react";
import {
  View,
  FlatList,
  Dimensions,
  TouchableOpacity,
  SafeAreaView,
  Text,
  ImageBackground,
  TextInput,
  StyleSheet,
  Keyboard,
  Platform,
  Animated,
} from "react-native";
import { useRouter } from "expo-router";
import { useUserPainStore } from "@/src/store/userPainStore";
import theme from "@/src/theme/theme";
import Button from "../ui/NextButton";
import LoadingBlob from "@/src/animations/LoadingBlob";
import SelectionButton from "../ui/SelectionButton";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { StatusBar } from "expo-status-bar";
import { useFonts } from "expo-font";

const { width, height } = Dimensions.get("window");

interface Slide {
  id: string;
  type: "loading" | "question" | "welcome";
  title: string;
  subtitle?: string | ((painType: string) => string);
  options?: string[][];
  character: boolean;
  showNext: boolean;
}

export default function Onboarding() {
  const router = useRouter();
  const { setPainType, setPainDuration } = useUserPainStore();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedPainType, setSelectedPainType] = useState("");
  const [selectedDuration, setSelectedDuration] = useState("");
  const [customPainType, setCustomPainType] = useState("");
  const [isScrolling, setIsScrolling] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const flatListRef = useRef<FlatList<any>>(null);
  const [fontsLoaded] = useFonts({
    LexendDecaBold: require("@/assets/fonts/LexendDeca-Bold.ttf"),
    LexendDecaRegular: require("@/assets/fonts/LexendDeca-Regular.ttf"),
  });
  const contentOffset = useRef(new Animated.Value(0)).current;

  const slides: Slide[] = [
    {
      id: "1",
      type: "loading",
      title: "Welcome to JustBe.",
      character: true,
      showNext: false,
    },
    {
      id: "2",
      type: "question",
      title: "What kind of chronic pain do you experience?",
      subtitle: "(Choose one)",
      options: [
        ["Sciatic", "Migraines"],
        ["Arthritis", "IBS"],
        ["Back Pain", "Fibromyalgia"],
        ["Other"],
      ],
      character: true,
      showNext: true,
    },
    {
      id: "3",
      type: "question",
      title: "How long have you been experiencing this?",
      subtitle: "This helps us understand your journey",
      options: [
        ["< 1 year", "1-3 years"],
        ["3-5 years", "5+ years"],
      ],
      character: true,
      showNext: true,
    },
    {
      id: "4",
      type: "welcome",
      title: "Hi, I'm blob!",
      subtitle: () => {
        const painType =
          selectedPainType === "Other" ? customPainType : selectedPainType;
        return `I will help you manage your ${painType}`;
      },
      character: true,
      showNext: true,
    },
  ];

  useEffect(() => {
    if (currentIndex === 0) {
      const timer = setTimeout(() => {
        if (currentIndex === 0) {
          moveToNextSlide();
        }
      }, 2000);

      return () => clearTimeout(timer);
    }
  }, [currentIndex]);

  const isValidScroll = (targetIndex: number) => {
    if (targetIndex <= currentIndex) return true;

    if (currentIndex === 1) {
      if (selectedPainType === "Other" && !customPainType.trim()) return false;
      if (!selectedPainType) return false;
    }

    if (currentIndex === 2 && !selectedDuration) return false;

    return true;
  };

  const moveToNextSlide = () => {
    if (isDragging) return;

    const nextIndex = currentIndex + 1;
    if (isValidScroll(nextIndex)) {
      setCurrentIndex(nextIndex);
      flatListRef.current?.scrollToIndex({
        index: nextIndex,
        animated: true,
      });
    }
  };

  const renderSlide = ({ item }: { item: Slide }) => (
    <View style={styles.slideContainer}>
      {item.type === "loading" ? (
        <View style={[styles.contentContainer, { paddingTop: 100 }]}>
          <LoadingBlob style={{ transform: [{ scale: 1.5 }] }} />
          <Text style={[styles.title, { marginTop: 50 }]}>{item.title}</Text>
        </View>
      ) : (
        <>
          <LoadingBlob />
          <View style={styles.contentContainer}>
            <Text style={styles.title}>{item.title}</Text>
            {item.subtitle && (
              <Text style={styles.subtitle}>
                {typeof item.subtitle === "function"
                  ? item.subtitle(selectedPainType)
                  : item.subtitle}
              </Text>
            )}

            {item.options && (
              <View
                style={{
                  alignItems: "center",
                  width: "100%",
                  paddingHorizontal: theme.spacing.lg,
                  maxWidth: 350,
                }}
              >
                {item.options.map((row: string[], rowIndex: number) => (
                  <View
                    key={rowIndex}
                    style={{
                      flexDirection: "row",
                      justifyContent: "center",
                      gap: theme.spacing.md,
                      marginBottom: theme.spacing.sm,
                      width: "100%",
                    }}
                  >
                    {row.map((option: string) => (
                      <SelectionButton
                        key={option}
                        title={option}
                        onPress={() => handleOptionSelect(option)}
                        selected={
                          item.id === "2"
                            ? selectedPainType === option
                            : item.id === "3"
                            ? selectedDuration === option
                            : false
                        }
                        isOther={option === "Other"}
                        customValue={customPainType}
                        onCustomValueChange={setCustomPainType}
                        style={{
                          width: option === "Other" ? 200 : 150,
                        }}
                      />
                    ))}
                  </View>
                ))}
              </View>
            )}

            {/* Show Get Started button only on welcome slide */}
            {item.id === "4" && (
              <Button
                title="Get Started"
                onPress={completeOnboarding}
                variant="primary"
                showArrow={false}
                style={{
                  marginTop: theme.spacing.lg,
                  paddingHorizontal: theme.spacing.lg,
                  paddingVertical: theme.spacing.sm,
                }}
              />
            )}
          </View>
        </>
      )}
    </View>
  );

  const handleOptionSelect = (option: string) => {
    console.log("Option selected:", option, "on slide:", currentIndex);

    if (currentIndex === 1) {
      setSelectedPainType(option);
      if (option !== "Other") {
        setCustomPainType("");
      }
    } else if (currentIndex === 2) {
      setSelectedDuration(option);
    }
  };

  useEffect(() => {
    if (currentIndex === 1 && selectedPainType) {
      moveToNextSlide();
    } else if (currentIndex === 2 && selectedDuration) {
      moveToNextSlide();
    }
  }, [selectedPainType, selectedDuration]);

  const completeOnboarding = async () => {
    try {
      const painType =
        selectedPainType === "Other" ? customPainType : selectedPainType;
      setPainType(painType);
      setPainDuration(selectedDuration);
      console.log("Saving to AsyncStorage:", { painType, selectedDuration });

      await AsyncStorage.setItem("painType", painType);
      await AsyncStorage.setItem("painDuration", selectedDuration);
      await AsyncStorage.setItem("hasCompletedOnboarding", "true");

      router.replace("/");
    } catch (error) {
      router.replace("/");
    }
  };

  useEffect(() => {
    const keyboardWillShow = Keyboard.addListener(
      Platform.OS === 'ios' ? 'keyboardWillShow' : 'keyboardDidShow',
      (e) => {
        Animated.timing(contentOffset, {
          toValue: (-e.endCoordinates.height / 2) - 100,
          duration: 250,
          useNativeDriver: true,
        }).start();

        flatListRef.current?.scrollToIndex({
          index: currentIndex,
          animated: true,
          viewPosition: 0.3,
        });
      }
    );

    const keyboardWillHide = Keyboard.addListener(
      Platform.OS === 'ios' ? 'keyboardWillHide' : 'keyboardDidHide',
      () => {
        Animated.timing(contentOffset, {
          toValue: 0,
          duration: 250,
          useNativeDriver: true,
        }).start();
      }
    );

    return () => {
      keyboardWillShow.remove();
      keyboardWillHide.remove();
    };
  }, [currentIndex]);

  return (
    <View style={{ flex: 1 }}>
      <StatusBar style="light" />
      <ImageBackground
        source={require("@/assets/background.png")}
        resizeMode="cover"
        style={styles.background}
      >
        <SafeAreaView style={styles.safeArea}>
          <Animated.View
            style={[
              styles.contentWrapper,
              { transform: [{ translateY: contentOffset }] }
            ]}
          >
            <FlatList
              data={slides}
              renderItem={renderSlide}
              horizontal
              pagingEnabled
              scrollEnabled={true}
              showsHorizontalScrollIndicator={false}
              snapToInterval={width}
              snapToAlignment="center"
              decelerationRate="fast"
              onScrollBeginDrag={() => setIsDragging(true)}
              onMomentumScrollEnd={(e) => {
                const newIndex = Math.round(
                  e.nativeEvent.contentOffset.x / width
                );

                if (newIndex < currentIndex || isValidScroll(newIndex)) {
                  setCurrentIndex(newIndex);
                } else {
                  flatListRef.current?.scrollToIndex({
                    index: currentIndex,
                    animated: true,
                  });
                }
                setIsDragging(false);
              }}
              keyExtractor={(item) => item.id}
              ref={flatListRef}
              contentContainerStyle={styles.flatListContent}
            />

            <View style={styles.dotsContainer}>
              {slides.map((_, index) => (
                <View
                  key={index}
                  style={[
                    styles.dot,
                    { opacity: currentIndex === index ? 1 : 0.5 }
                  ]}
                />
              ))}
            </View>
          </Animated.View>
        </SafeAreaView>
      </ImageBackground>
    </View>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    width: "100%",
    height: "100%",
  },
  safeArea: {
    flex: 1,
    backgroundColor: "transparent",
  },
  contentWrapper: {
    flex: 1,
    paddingVertical: theme.spacing.lg,
  },
  flatListContent: {
    flexGrow: 1,
    justifyContent: 'center',
  },
  slideContainer: {
    width,
    alignItems: "center",
    padding: theme.spacing.lg,
    paddingTop: Platform.OS === 'ios' ? 60 : 40,
  },
  contentContainer: {
    width: "100%",
    alignItems: "center",
    paddingTop: theme.spacing.md,
  },
  title: {
    fontSize: theme.typography.sizes.xl,
    color: theme.colors.white,
    fontFamily: theme.typography.fonts.regular,
    marginBottom: theme.spacing.sm,
    textAlign: "center",
  },
  subtitle: {
    color: theme.colors.white,
    textAlign: "center",
    opacity: 0.8,
    marginBottom: theme.spacing.lg,
    fontSize: theme.typography.sizes.lg,
    fontFamily: theme.typography.fonts.regular,
  },
  optionsContainer: {
    width: "100%",
    alignItems: "center",
    gap: theme.spacing.md,
  },
  dotsContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginBottom: theme.spacing.lg,
    paddingBottom: Platform.OS === 'ios' ? 20 : 10,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: theme.colors.white,
    marginHorizontal: 4,
  },
});
