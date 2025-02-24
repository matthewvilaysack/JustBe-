// src/components/screens/Onboarding.tsx
import React, { useState, useRef, useEffect } from "react";
import {
  View,
  FlatList,
  Dimensions,
  TouchableOpacity,
  SafeAreaView,
  Text,
  ImageBackground,
} from "react-native";
import { useRouter } from "expo-router";
import theme from "@/src/theme/theme";
import Button from "../ui/NextButton";
import LoadingBlob from "@/src/animations/LoadingBlob";
import SelectionButton from "../ui/SelectionButton";
import AsyncStorage from "@react-native-async-storage/async-storage";

const { width, height } = Dimensions.get("window");

const slides = [
  {
    id: "1",
    type: "loading",
    title: "...",
    character: true,
  },
  {
    id: "2",
    type: "question",
    title: "What kind of chronic pain do you experience?",
    subtitle: "(Choose one)",
    options: [
      "Sciatic",
      "OCD",
      "Arthritis",
      "Fibromyalgia",
      "CKD",
      "Alzheimers",
    ],
    character: true,
    showNext: true,
  },
  {
    id: "3",
    type: "question",
    title: "How long have you been experiencing this?",
    subtitle: "This helps us understand your journey",
    options: ["< 1 year", "1-3 years", "3-5 years", "5+ years"],
    character: true,
    showNext: true,
  },
  {
    id: "4",
    type: "welcome",
    title: "My name is blob by the way!",
    subtitle: "I will do my best to help you better manage your OCD",
    character: true,
    showNext: true,
  },
];

export default function Onboarding() {
  const router = useRouter();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState("");
  const flatListRef = useRef<FlatList<any>>(null);

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
    const nextIndex = currentIndex + 1;
    flatListRef.current?.scrollToIndex({ index: nextIndex, animated: true });
  };

  const renderSlide = ({ item }: { item: any }) => (
    <View
      style={{
        width,
        alignItems: "center",
        padding: theme.spacing.lg,
        position: "relative",
      }}
    >
      {item.type === "loading" ? (
        <View
          style={{
            flex: 1,
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <LoadingBlob style={{ transform: [{ scale: 1.5 }] }} />
        </View>
      ) : (
        <>
          <View
            style={{
              position: "relative",
            }}
          >
            <LoadingBlob />
          </View>

          <View
            style={{
              marginTop: theme.spacing.lg,
              width: "100%",
              alignItems: "center",
              justifyContent: "flex-start",
            }}
          >
            <Text
              style={{
                fontSize: theme.typography.sizes.xl,
                color: theme.colors.white,
                fontFamily: theme.typography.fonts.bold,
                marginBottom: theme.spacing.sm,
                textAlign: "center",
              }}
            >
              {item.title}
            </Text>

            {item.subtitle && (
              <Text
                style={{
                  color: theme.colors.white,
                  textAlign: "center",
                  opacity: 0.8,
                  marginBottom: theme.spacing.lg,
                  fontSize: theme.typography.sizes.lg,
                  fontFamily: theme.typography.fonts.bold,
                }}
              >
                {item.subtitle}
              </Text>
            )}

            {item.options && (
              <View
                style={{
                  flexDirection: "row",
                  flexWrap: "wrap",
                  justifyContent: "center",
                  gap: theme.spacing.xs,
                  paddingHorizontal: theme.spacing.lg,
                  width: "100%",
                  maxWidth: 350,
                }}
              >
                {item.options.map((option: string) => (
                  <SelectionButton
                    key={option}
                    title={option}
                    onPress={() => setSelectedOption(option)}
                    selected={selectedOption === option}
                    style={{
                      width: option.length > 8 ? 150 : 120,
                      height: 40,
                      marginBottom: theme.spacing.xs,
                    }}
                  />
                ))}
              </View>
            )}
          </View>
        </>
      )}
    </View>
  );

  const completeOnboarding = async () => {
    try {
      console.log("Setting onboarding completed..."); // Debug log
      await AsyncStorage.setItem("hasCompletedOnboarding", "true");
      console.log("Onboarding completed set successfully"); // Debug log
      router.replace("/");
    } catch (error) {
      console.error("Error completing onboarding:", error);
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
              showsHorizontalScrollIndicator={false}
              onScroll={(e) => {
                const contentOffset = e.nativeEvent.contentOffset.x;
                const currentIndex = Math.round(contentOffset / width);
                setCurrentIndex(currentIndex);
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

            {/* show get started only on last slide */}

            {currentIndex === slides.length - 1 && (
              <View style={{ paddingHorizontal: theme.spacing.lg }}>
                <Button
                  title="Get Started"
                  onPress={completeOnboarding}
                  variant="primary"
                  showArrow={false}
                  style={{ alignSelf: "center", width: 200 }}
                />
              </View>
            )}
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
