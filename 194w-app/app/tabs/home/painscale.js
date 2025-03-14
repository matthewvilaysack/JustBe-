import React, { useState, useRef, useEffect } from "react";
import {
  StyleSheet,
  View,
  ImageBackground,
  Image,
  Text,
  Dimensions,
  FlatList,
  Animated,
} from "react-native";
import Slider from "@react-native-community/slider";
import { useRouter } from "expo-router";
import Theme from "@/src/theme/theme";
import NextButton from "@/src/components/ui/NextButton";
import BackButton from "@/src/components/ui/BackButton";

import theme from "@/src/theme/theme";
import { usePainLevelStore } from "@/src/store/painlevelStore";

const { width, height } = Dimensions.get("window");
const ITEM_WIDTH = width * 0.5;
const ITEM_MARGIN = 30;

const images = [
  { id: 1, src: require("@/assets/blob-no-pain.png"), label: "No Pain" },
  { id: 2, src: require("@/assets/blob-mild.png"), label: "Mild" },
  { id: 3, src: require("@/assets/blob-moderate.png"), label: "Moderate" },
  { id: 4, src: require("@/assets/blob-severe.png"), label: "Severe" },
  {
    id: 4,
    src: require("@/assets/blob-very-severe.png"),
    label: "Very Severe",
  },
  { id: 5, src: require("@/assets/blob-worst.png"), label: "Worst" },
];

const painLevelDescriptions = {
  0: "No pain",
  1: "Hardly noticeable pain",
  2: "Mild pain but doesn't interfere",
  3: "Sometimes distracting pain",
  4: "Distracting pain but no interruptions",
  5: "Moderate pain that interrupts activities",
  5: "Moderate pain that interrupts activities",
  6: "Hard to ignore pain and avoiding activities",
  7: "Severe pain that is focus of attention",
  8: "Very severe pain that is hard to tolerate",
  9: "Can't bear the pain, unable to do anything",
  10: "Worst pain imaginable, nothing else matters",
};

export default function Page() {
  const router = useRouter();
  const [selectedIndex, setSelectedIndex] = useState(0);
  const { painLevel, setPainLevel } = usePainLevelStore();
  const flatListRef = useRef(null);

  useEffect(() => {
    setPainLevel(0);
  }, []);

  useEffect(() => {
    setPainLevel(0);
  }, []);

  const mapSliderToIndex = (value) => Math.ceil(value / 2);
  const handleSliderChange = (value) => {
    setPainLevel(value);
    const index = mapSliderToIndex(value);
    setSelectedIndex(index);
    flatListRef.current?.scrollToIndex({
      index,
      animated: true,
      viewPosition: 0.5,
    });
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

      <View style={styles.background}>
        <View style={styles.container}>
          <Text style={styles.heading}>How would you rate your pain?</Text>
          <View style={styles.carousel}>
            <FlatList
              ref={flatListRef}
              data={images}
              horizontal
              pagingEnabled
              showsHorizontalScrollIndicator={false}
              snapToInterval={ITEM_WIDTH + ITEM_MARGIN}
              keyExtractor={(_, index) => index.toString()}
              scrollEnabled={false}
              contentContainerStyle={{
                paddingHorizontal: (width - ITEM_WIDTH) / 2,
              }}
              ItemSeparatorComponent={() => (
                <View style={{ width: ITEM_MARGIN }} />
              )}
              renderItem={({ item }) => (
                <View style={styles.carouselItem}>
                  <Image source={item.src} style={styles.blobImage} />
                </View>
              )}
            />
          </View>
        </View>
        <View style={styles.sliderContainer}>
          <View style={styles.levelContainer}>
            <Text style={styles.description}>
              {painLevel} - {painLevelDescriptions[painLevel]}
            </Text>
          </View>
          <Slider
            style={styles.slider}
            minimumValue={0}
            maximumValue={10}
            step={1}
            value={selectedIndex * 2}
            onValueChange={handleSliderChange}
            minimumTrackTintColor={theme.colors.primary[200]}
            maximumTrackTintColor={theme.colors.white}
            thumbTintColor={theme.colors.white}
          />
        </View>

        <View style={styles.footer}>
          <NextButton
            onPress={() => router.push("/tabs/home/journal")}
            showArrow={true}
          />
        </View>
        <View style={styles.footer}>
          <NextButton
            onPress={() => router.push("/tabs/home/journal")}
            showArrow={true}
          />
        </View>
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    height: height,
    flexDirection: "column",
    justifyContent: "center",
    height: height,
    flexDirection: "column",
    justifyContent: "center",
  },
  container: {
    justifyContent: "flex-start",
    alignItems: "center",
    alignSelf: "center",
    alignSelf: "center",
  },
  heading: {
    fontSize: Theme.typography.sizes.xl,
    color: Theme.colors.white,
    textAlign: "center",
    fontFamily: Theme.typography.fonts.bold,
    paddingHorizontal: Theme.spacing.sm,
  },
  description: {
    fontSize: Theme.typography.sizes.lg,
    color: Theme.colors.white,
    textAlign: "center",
    fontFamily: Theme.typography.fonts.regular,
  },
  carousel: {
    height: height / 2 - Theme.spacing.xl * 2 - Theme.spacing.lg * 2,
    height: height / 2 - Theme.spacing.xl * 2 - Theme.spacing.lg * 2,
    minWidth: width,
  },
  carouselItem: {
    alignItems: "center",
    justifyContent: "center",
  },
  blobImage: {
    width: ITEM_WIDTH,
    height: ITEM_WIDTH,
    resizeMode: "contain",
  },
  sliderContainer: {
    flex: 1,
    justifyContent: "flex-end",
    alignItems: "center",
    maxHeight: Theme.spacing.lg * 4,
    maxHeight: Theme.spacing.lg * 4,
  },
  levelContainer: {
    backgroundColor: theme.colors.darkPurple,
    borderRadius: theme.radius.lg,
    padding: theme.spacing.md,
  },
  slider: {
    width: width - Theme.spacing.xl * 2,
  },
  buttonContainer: {
    position: "absolute",
    top: "7%",
    left: "3%",
    //opacity: 0.9,
    left: "3%",
    //opacity: 0.9,
  },
  footer: {
    position: "absolute",
    bottom: 0,
    width: "100%",
    position: "absolute",
    bottom: 0,
    width: "100%",
    flexDirection: "row",
    justifyContent: "flex-end",
    alignSelf: "flex-end",
    maxHeight: height * 0.1,
    alignSelf: "flex-end",
    maxHeight: height * 0.1,
    paddingBottom: Theme.spacing.lg,
    paddingRight: Theme.spacing.lg,
  },
});
