import { Stack } from "expo-router";
import { View, Text, Platform, TouchableOpacity } from "react-native";
import theme from "../../../src/theme/theme";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import { useRouter } from "expo-router";

export default function Layout() {
  const router = useRouter();

  return (
    <Stack>
      <Stack.Screen
        name="index"
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="painscale"
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="journal"
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="confirm"
        options={{
          headerShown: false,
        }}
      />
    </Stack>
  );
}
