import { Stack } from "expo-router";

export default function Layout() {
  return (
    <Stack>
      <Stack.Screen
        name="index"
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="generating"
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="summary"
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="plots"
        options={{
          headerShown: false,
        }}
      />
    </Stack>
  );
}
