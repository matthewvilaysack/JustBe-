import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Alert,
  Image,
  ImageBackground,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { useRouter } from "expo-router";
import { supabase } from "@/src/lib/api/supabase";
import useJournalStore from "@/src/store/journalStore";
import Theme from "@/src/theme/theme";
import { LinearGradient } from "expo-linear-gradient";

export default function Profile() {
  const [user, setUser] = useState(null);
  const [profileImage, setProfileImage] = useState(null);
  const router = useRouter();
  const CURRENT_TAB_DETAILS = "/tabs/profile/details";

  useEffect(() => {
    async function fetchUser() {
      try {
        const { data, error } = await supabase.auth.getUser();

        if (error) {
          console.error("User fetch error:", error);
          Alert.alert(
            "Oops! We couldn't retrieve your account details :(",
            "Please check your connection and try again."
          );
          return;
        }

        setUser(data.user);
      } catch (err) {
        console.error("Unexpected error:", err);
        Alert.alert(
          "Unexpected Error",
          "Something went wrong. Please try again later."
        );
      }
    }

    fetchUser();
  }, []);

  async function handleSignOut() {
    useJournalStore.getState().clearLogs();
    const { error } = await supabase.auth.signOut();
    if (error) {
      Alert.alert(
        "Oops! Something went wrong",
        "We're working on this, but in the meantime, please check your connection and try again."
      );
    } else {
      router.replace("/"); // Redirect to login page after sign out
    }
  }

  async function pickImage() {
    let result = await ImagePicker.launchImageLibraryAsync({
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!result.canceled) {
      setProfileImage(result.assets[0].uri);
    }
  }

  return (
    <ImageBackground
      source={require("@/assets/background.png")}
      resizeMode="cover"
      style={styles.background}
    >
      <LinearGradient
        colors={["#5CA2C0", "#2B4F8E"]}
        locations={[0, 0.55]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.container}
      >
        <Text style={styles.heading}>Your Profile</Text>
        <View style={styles.profileImageContainer}>
          {profileImage ? (
            <Image source={{ uri: profileImage }} style={styles.profileImage} />
          ) : (
            <FontAwesome
              name="user-circle"
              size={150}
              color={Theme.colors.primary[200]}
              style={styles.profileImage}
            />
          )}
          <TouchableOpacity style={styles.uploadButton} onPress={pickImage}>
            <FontAwesome
              name="pencil"
              size={24}
              color={Theme.colors.darkBlue}
            />
          </TouchableOpacity>
        </View>
        {user ? (
          <Text style={styles.email}>{user.email}</Text>
        ) : (
          <Text style={styles.email}>Loading...</Text>
        )}
        <TouchableOpacity style={styles.button} onPress={handleSignOut}>
          <Text style={styles.buttonText}>Sign Out</Text>
        </TouchableOpacity>
      </LinearGradient>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  container: {
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: Theme.colors.darkBlue,
    padding: Theme.spacing.xxl * 1.5,
    borderRadius: Theme.radius.xl * 2,
  },
  heading: {
    fontSize: Theme.typography.sizes.xl,
    fontWeight: "bold",
    marginBottom: Theme.spacing.xl,
    color: Theme.colors.primary[50],
  },
  profileImageContainer: {
    position: "relative",
    marginBottom: Theme.spacing.md,
  },
  profileImage: {
    width: 150,
    height: 150,
    borderRadius: 200,
  },
  uploadButton: {
    position: "absolute",
    bottom: 0,
    right: 0,
    backgroundColor: Theme.colors.button.secondary.background,
    padding: Theme.spacing.sm,
    borderRadius: Theme.radius.lg,
    alignItems: "center",
    justifyContent: "center",
  },
  email: {
    fontSize: Theme.typography.sizes.md,
    color: Theme.colors.primary[50],
    marginBottom: Theme.spacing.md,
    fontFamily: Theme.typography.fonts.regular,
  },
  button: {
    backgroundColor: Theme.colors.button.primary.background,
    paddingVertical: Theme.spacing.sm,
    paddingHorizontal: Theme.spacing.lg,
    borderRadius: Theme.radius.lg,
    alignItems: "center",
    justifyContent: "center",
    marginTop: Theme.spacing.lg,
  },
  buttonText: {
    color: Theme.colors.darkBlue,
    fontSize: Theme.typography.sizes.md,
    fontWeight: "bold",
  },
});
