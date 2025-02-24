import { StyleSheet, View, ImageBackground, Image, Text } from "react-native";
import { Link } from "expo-router";
import Theme from "@/src/theme/theme";
import Button from "@/src/components/ui/Button";
import { useRouter } from "expo-router";

export default function Page() {
  const router = useRouter();

  return (
    <ImageBackground
      source={require("@/assets/background.png")}
      resizeMode="cover"
      style={styles.background}
    >
      <View style={styles.container}>
        <Text style={styles.heading}>Hi,{"\n"}how's your pain today?</Text>
        <Image
          source={require("@/assets/blob-no-pain.png")}
          style={styles.blobImage}
        />
        <View style={[styles.buttonContainer, { borderTopRightRadius: 0 }]}>
          <Button
            title="Log Entry"
            onPress={() => router.push("/tabs/home/painscale")}
          />
          <Button
            title="View Charts"
            onPress={() => router.push("/tabs/home/charts")}
          />
        </View>
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
  },
  heading: {
    fontSize: Theme.typography.sizes.xl,
    color: Theme.colors.white,
    textAlign: "center",
    fontFamily: Theme.typography.fonts.bold,
  },
  blobImage: {
    width: 250,
    height: 250,
    resizeMode: "contain",
  },
  buttonContainer: {
    marginVertical: 10,
    flexDirection: "row",
  },
});
