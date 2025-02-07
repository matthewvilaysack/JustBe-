import { StyleSheet, Text, View, TouchableOpacity, Alert } from "react-native";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { useRouter, Link } from "expo-router";
import { supabase } from '@/src/lib/supabase';
import Theme from "@/src/theme/theme";

export default function Profile() {
  const router = useRouter();
  const CURRENT_TAB_DETAILS = "/tabs/profile/details";

  const signOut = async () => {
    try {
      const { error } = await supabase.auth.signOut();
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

  return <View style={styles.container}></View>;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Theme.colors.backgroundPrimary,
  },
});
