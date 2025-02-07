import React, { useState } from "react";
import {
  Alert,
  StyleSheet,
  View,
  TextInput,
  Text,
  TouchableOpacity,
} from "react-native";
import { supabase } from "../lib/supabase";
import Theme from "@/src/theme/theme";

export default function Auth() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  async function signInWithEmail() {
    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({
      email: email,
      password: password,
    });

    if (error) Alert.alert(error.message);
    setLoading(false);
  }

  async function signUpWithEmail() {
    setLoading(true);
    const {
      data: { session },
      error,
    } = await supabase.auth.signUp({
      email: email,
      password: password,
    });

    if (error) Alert.alert(error.message);
    if (!session)
      Alert.alert("Please check your inbox for email verification!");
    setLoading(false);
  }

  return (
    <View style={styles.container}>
      <View style={[styles.verticallySpaced, styles.mt20]}>
        <Text style={styles.inputLabel}>Email</Text>
        <TextInput
          leftIcon={{ type: "font-awesome", name: "envelope" }}
          onChangeText={(text) => setEmail(text)}
          value={email}
          placeholder="email@address.com"
          autoCapitalize={"none"}
          style={styles.inputText}
        />
      </View>
      <View style={styles.verticallySpaced}>
        <Text style={styles.inputLabel}>Password</Text>
        <TextInput
          label="Password"
          leftIcon={{ type: "font-awesome", name: "lock" }}
          onChangeText={(text) => setPassword(text)}
          value={password}
          secureTextEntry={true}
          placeholder="Password"
          autoCapitalize={"none"}
          style={styles.inputText}
        />
      </View>
      <View style={[styles.verticallySpaced, styles.mt20]}>
        <TouchableOpacity
          style={[styles.button, loading && styles.disabledButton]}
          onPress={() => signInWithEmail()}
          disabled={loading}
        >
          <Text style={styles.buttonText}>Sign in</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.verticallySpaced}>
        <TouchableOpacity
          style={[styles.button, loading && styles.disabledButton]}
          onPress={() => signUpWithEmail()}
          disabled={loading}
        >
          <Text style={styles.buttonText}>Sign up</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginVertical: Theme.spacing.xl,
    padding: Theme.spacing.lg,
    minWidth: "85%",
    backgroundColor: Theme.colors.primary[400],
    borderRadius: Theme.radius.xl,
  },
  verticallySpaced: {
    paddingTop: Theme.spacing.xs,
    paddingBottom: Theme.spacing.xs,
    alignSelf: "stretch",
  },
  mt20: {
    marginTop: Theme.spacing.md,
  },
  inputText: {
    backgroundColor: Theme.colors.white,
    borderRadius: Theme.radius.lg,
    minHeight: 50,
    padding: Theme.spacing.md,
    color: Theme.colors.text.primary,
    fontSize: Theme.typography.sizes.md,
    fontFamily: "Helvetica",
  },
  inputLabel: {
    minHeight: 30,
    paddingLeft: Theme.spacing.sm,
    color: Theme.colors.text.inverse,
    fontSize: Theme.typography.sizes.lg,
    marginTop: Theme.spacing.md,
    fontFamily: "Helvetica-Bold",
  },
  button: {
    backgroundColor: Theme.colors.button.primary.background,
    paddingVertical: Theme.spacing.sm,
    paddingHorizontal: Theme.spacing.lg,
    borderRadius: Theme.radius.lg,
    alignItems: "center",
    justifyContent: "center",
  },
  disabledButton: {
    opacity: 0.7,
  },
  buttonText: {
    color: Theme.colors.button.primary.text,
    fontSize: Theme.typography.sizes.lg,
    fontFamily: "Helvetica-Bold",
  },
});
