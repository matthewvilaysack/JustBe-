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
} from "react-native";
import { useRouter } from "expo-router";
import theme from "@/src/theme/theme";
import Button from "../ui/NextButton";
import LoadingBlob from "@/src/animations/LoadingBlob";
import SelectionButton from "../ui/SelectionButton";
import AsyncStorage from "@react-native-async-storage/async-storage";

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
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedPainType, setSelectedPainType] = useState("");
  const [selectedDuration, setSelectedDuration] = useState("");
  const [customPainType, setCustomPainType] = useState("");
  const [isManualScrolling, setIsManualScrolling] = useState(false);
  const [lastOffset, setLastOffset] = useState(0);
  const flatListRef = useRef<FlatList<any>>(null);

  const slides: Slide[] = [
    {
      id: "1",
      type: "loading",
      title: "...",
      character: true,
      showNext: false,
    },
    {
      id: "2",
      type: "question",
      title: "What kind of chronic pain do you experience?",
      subtitle: "(Choose one)",
      options: [
        ["Sciatic", "OCD"],
        ["Arthritis", "CKD"],
        ["Joint Pain", "Alzheimers"],
        ["Other"]
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
        ["3-5 years", "5+ years"]
      ],
      character: true,
      showNext: true,
    },
    {
      id: "4",
      type: "welcome",
      title: "Hi, I'm blob!",
      subtitle: () => {
        const painType = selectedPainType === "Other" ? customPainType : selectedPainType;
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

  const moveToNextSlide = () => {
    if (isManualScrolling) return;

    // Validation checks
    if (currentIndex === 1) {
      if (selectedPainType === "Other" && !customPainType.trim()) return;
      if (!selectedPainType) return;
    }
    
    if (currentIndex === 2 && !selectedDuration) return;

    const nextIndex = currentIndex + 1;
    setCurrentIndex(nextIndex);
    flatListRef.current?.scrollToIndex({ index: nextIndex, animated: true });
  };

  const renderSlide = ({ item }: { item: Slide }) => (
    <View style={styles.slideContainer}>
      {item.type === "loading" ? (
        <LoadingBlob style={{ transform: [{ scale: 1.5 }], marginTop: 100 }} />
      ) : (
        <>
          <LoadingBlob />
          <View style={styles.contentContainer}>
            <Text style={styles.title}>{item.title}</Text>
            {item.subtitle && (
              <Text style={styles.subtitle}>
                {typeof item.subtitle === 'function' 
                  ? item.subtitle(selectedPainType)
                  : item.subtitle
                }
              </Text>
            )}
            
            {item.options && (
              <View style={{
                alignItems: "center",
                width: "100%",
                paddingHorizontal: theme.spacing.lg,
                maxWidth: 350,
              }}>
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
                        selected={currentIndex === 2 ? selectedDuration === option : selectedPainType === option}
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
                style={{ width: 200, marginTop: theme.spacing.xl }}
              />
            )}
          </View>
        </>
      )}
    </View>
  );

  const handleOptionSelect = (option: string) => {
    if (currentIndex === 1) {
      setSelectedPainType(option);
      // Only clear customPainType if switching away from "Other"
      if (option !== "Other") {
        setCustomPainType("");
      }
    } else if (currentIndex === 2) {
      setSelectedDuration(option);
    }
  };

  const completeOnboarding = async () => {
    try {
      const painType = selectedPainType === "Other" ? customPainType : selectedPainType;
      console.log('💾 Saving to AsyncStorage:', { painType, selectedDuration });
      
      await AsyncStorage.setItem("painType", painType);
      await AsyncStorage.setItem("painDuration", selectedDuration);
      await AsyncStorage.setItem("hasCompletedOnboarding", "true");
      
      console.log('✅ Successfully saved to AsyncStorage');
      router.replace("/");
    } catch (error) {
      console.error("❌ Error completing onboarding:", error);
      router.replace("/");
    }
  };

  return (
    <View style={{ flex: 1 }}>
      <ImageBackground
        source={require("@/assets/background.png")}
        resizeMode="cover"
        style={{
          flex: 1,
          width: "100%",
          height: "100%",
        }}
      >
        <SafeAreaView
          style={{
            flex: 1,
            backgroundColor: "transparent",
          }}
        >
          <View
            style={{
              paddingVertical: theme.spacing.lg,
            }}
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
              onScrollBeginDrag={(e) => {
                setLastOffset(e.nativeEvent.contentOffset.x);
                setIsManualScrolling(true);
              }}
              onScrollEndDrag={() => setIsManualScrolling(false)}
              onMomentumScrollEnd={(e) => {
                const contentOffset = e.nativeEvent.contentOffset.x;
                const newIndex = Math.round(contentOffset / width);
                
                // Only allow backward scrolling manually
                if (contentOffset < lastOffset || !isManualScrolling) {
                  setCurrentIndex(newIndex);
                }
                setIsManualScrolling(false);
              }}
              scrollEventThrottle={16}
              keyExtractor={(item) => item.id}
              ref={flatListRef}
            />

            {/* dots  */}
            <View
              style={{
                flexDirection: "row",
                justifyContent: "center",
                marginBottom: theme.spacing.lg,
              }}
            >
              {slides.map((_, index) => (
                <View
                  key={index}
                  style={{
                    width: 8,
                    height: 8,
                    borderRadius: 4,
                    backgroundColor: theme.colors.white,
                    marginHorizontal: 4,
                    opacity: currentIndex === index ? 1 : 0.5,
                  }}
                />
              ))}
            </View>
          </View>
        </SafeAreaView>
        {currentIndex !== 0 && currentIndex !== slides.length - 1 && (
          <View
            style={{
              paddingHorizontal: theme.spacing.lg,
              alignItems: "flex-end",
            }}
          >
            <Button
              title="Next"
              onPress={() => moveToNextSlide()}
              variant="primary"
              showArrow={true}
              style={{
                position: "absolute",
                bottom: 50,
                right: 25,
                width: 120,
              }}
            />
          </View>
        )}
      </ImageBackground>
    </View>
  );
}

const styles = StyleSheet.create({
  slideContainer: {
    width,
    alignItems: "center",
    padding: theme.spacing.lg,
  },
  contentContainer: {
    marginTop: theme.spacing.lg,
    width: "100%",
    alignItems: "center",
  },
  title: {
    fontSize: theme.typography.sizes.xl,
    color: theme.colors.white,
    fontFamily: theme.typography.fonts.bold,
    marginBottom: theme.spacing.sm,
    textAlign: "center",
  },
  subtitle: {
    color: theme.colors.white,
    textAlign: "center",
    opacity: 0.8,
    marginBottom: theme.spacing.lg,
    fontSize: theme.typography.sizes.lg,
    fontFamily: theme.typography.fonts.bold,
  },
  optionsContainer: {
    width: "100%",
    alignItems: "center",
    gap: theme.spacing.md,
  },
});
