import React, { useState } from "react";
import {
  Alert,
  StyleSheet,
  View,
  TextInput,
  Text,
  TouchableOpacity,
  Keyboard,
  TouchableWithoutFeedback,
} from "react-native";
import { supabase } from "@/src/lib/api/supabase";
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
    <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
      <View style={styles.outerContainer}>
        <View style={styles.container}>
          <View style={[styles.verticallySpaced, styles.mt20]}>
            <Text style={styles.inputLabel}>Email</Text>
            <TextInput
              label="Email"
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
      </View>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  outerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: Theme.spacing.lg,
  },
  container: {
    marginVertical: Theme.spacing.xl,
    padding: Theme.spacing.xl,
    width: '90%',
    maxWidth: 400,
    backgroundColor: Theme.colors.primary[400],
    borderRadius: Theme.radius.xl,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
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
