import React, { useEffect, useState } from "react";
import { StyleSheet, Text, View, TouchableOpacity, Alert } from "react-native";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { useRouter, Link } from "expo-router";
import { supabase } from "@/src/lib/api/supabase";
import useJournalStore from "@/src/store/journalStore";
import Theme from "@/src/theme/theme";

export default function Profile() {
  const [user, setUser] = useState(null);
  const router = useRouter();
  const CURRENT_TAB_DETAILS = "/tabs/profile/details";

  useEffect(() => {
    async function fetchUser() {
      const { data, error } = await supabase.auth.getUser();
      if (error) {
        Alert.alert("Error fetching user", error.message);
      } else {
        setUser(data.user);
      }
    }

    fetchUser();
  }, []);

  async function handleSignOut() {
    useJournalStore.getState().clearLogs();
    const { error } = await supabase.auth.signOut();
    if (error) {
      Alert.alert("Error", error.message);
    } else {
      router.replace("/"); // Redirect to login page after sign out
    }
  }

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Profile</Text>
      {user ? (
        <Text style={styles.email}>{user.email}</Text>
      ) : (
        <Text>Loading...</Text>
      )}

      <TouchableOpacity style={styles.button} onPress={handleSignOut}>
        <Text style={styles.buttonText}>Sign Out</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: Theme.colors.background,
    padding: Theme.spacing.lg,
  },
  heading: {
    fontSize: Theme.typography.sizes.xl,
    fontWeight: "bold",
    marginBottom: Theme.spacing.lg,
    color: Theme.colors.text.primary,
  },
  email: {
    fontSize: Theme.typography.sizes.md,
    color: Theme.colors.text.secondary,
    marginBottom: Theme.spacing.md,
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
    color: Theme.colors.button.primary.text,
    fontSize: Theme.typography.sizes.md,
    fontWeight: "bold",
  },
});
