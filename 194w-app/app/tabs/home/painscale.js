import React, { useState } from "react";
import {
  StyleSheet,
  View,
  ImageBackground,
  Image,
  Text,
  Dimensions,
} from "react-native";
import Carousel from "react-native-reanimated-carousel";
import { useRouter } from "expo-router";
import Theme from "@/src/theme/theme";
import Button from "@/src/components/ui/Button";

const { width } = Dimensions.get("window");
const ITEM_WIDTH = width * 0.7; // Normal size
const ITEM_HEIGHT = 200;
const SPACING = 10; // Space between items

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

export default function Page() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const router = useRouter();

  return (
    <ImageBackground
      source={require("@/assets/background.png")}
      resizeMode="cover"
      style={styles.background}
    >
      <View style={styles.container}>
        <Text style={styles.heading}>How would you rate your pain?</Text>
        <View style={styles.carousel}>
          <Carousel
            width={width}
            //   height={width / 2}
            data={images}
            renderItem={({ item }) => (
              <View style={styles.carouselItem}>
                <Image source={item.src} style={styles.blobImage} />
                <Text style={styles.heading}>{item.label}</Text>
              </View>
            )}
          />
        </View>
      </View>
      <View style={styles.footer}>
        <Button
          onPress={() => router.push("/tabs/home/journal")}
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
    marginBottom: Theme.spacing.xl,
    fontFamily: Theme.typography.fonts.bold,
  },
  carousel: {
    height: width / 2 + Theme.typography.sizes.xl * 2 + 10,
  },
  carouselItem: {
    alignItems: "center",
    justifyContent: "center",
    margin: 10,
  },
  blobImage: {
    width: 200,
    height: 200,
    resizeMode: "contain",
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
