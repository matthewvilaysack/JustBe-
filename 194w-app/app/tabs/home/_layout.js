import { Stack } from "expo-router";
import { View, Text, Platform, TouchableOpacity } from "react-native";
import theme from "../../../src/theme/theme";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useRouter } from "expo-router";

const queryClient = new QueryClient();

export default function Layout() {
  const router = useRouter();

  return (
    <QueryClientProvider client={queryClient}>
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
          name="charts"
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
    </QueryClientProvider>
  );
}
