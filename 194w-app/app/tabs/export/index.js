import { StyleSheet, Text, View, TouchableOpacity, Alert } from "react-native";
import { useRouter, Link } from "expo-router";
import Theme from "@/src/theme/theme";

export default function Export() {
  const router = useRouter();
  return <View style={styles.container}></View>;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Theme.colors.backgroundPrimary,
  },
});
