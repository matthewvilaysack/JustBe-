import { StyleSheet, View, ImageBackground, Image, Text } from "react-native";
import { Link } from "expo-router";
import Theme from "@/src/theme/theme";
import Button from "@/src/components/Button";

export default function Page() {
  return (
    <ImageBackground
      source={require("@/assets/background.png")}
      resizeMode="cover"
      style={styles.background}
    >
      <View style={styles.container}>
        <Text style={styles.heading}>Hi Bob,{"\n"}how's your pain today?</Text>
        
        <Image 
          source={require("@/assets/blob-smile.png")} 
          style={styles.blobImage}
        />
        
        <View style={styles.buttonContainer}>
          <Button 
            title="Log" 
            onPress={() => {}}
          />
          <Button 
            title="Charts" 
            onPress={() => {}}
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
    padding: Theme.spacing.xl,
  },
  heading: {
    fontSize: Theme.typography.sizes.xl,
    color: Theme.colors.white,
    textAlign: 'center',
    marginBottom: Theme.spacing.xl,
    fontFamily: Theme.typography.fonts.bold,
  },
  blobImage: {
    width: 200,
    height: 200,
    marginVertical: Theme.spacing.xl,
  },
  buttonContainer: {
    position: 'absolute',
    bottom: Theme.spacing.xxl,
    alignItems: 'center',
    gap: Theme.spacing.xl,
  },
});
