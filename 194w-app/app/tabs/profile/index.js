import { StyleSheet, Text, View, TouchableOpacity, Alert } from "react-native";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { useRouter, Link } from "expo-router";

import Theme from "@/assets/theme";
import db from "@/database/db";
import useSession from "@/utils/useSession";

export default function Profile() {
  const session = useSession();
  const router = useRouter();
  const CURRENT_TAB_DETAILS = "/tabs/profile/details";

  const signOut = async () => {
    try {
      const { error } = await db.auth.signOut();
      if (error) {
        Alert.alert(error.message);
      } else {
        router.navigate("/");
        Alert.alert("Sign out successful.");
      }
    } catch (err) {
      console.log(err);
    }
  };

  // if (!session) {
  //   return <Loading />;
  // }

  return <View style={styles.container}></View>;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Theme.colors.backgroundPrimary,
  },
});
