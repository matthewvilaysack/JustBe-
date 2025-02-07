import FontAwesome from "@expo/vector-icons/FontAwesome";
import { Tabs } from "expo-router";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import theme from "../../src/theme/theme";

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: theme.colors.white,
        tabBarInactiveTintColor: theme.colors.primary[200],
        tabBarStyle: {
          backgroundColor: theme.colors.primary[400],
        },
        headerStyle: {
          backgroundColor: theme.colors.backgroundPrimary,
          elevation: 0, // Android
          shadowOpacity: 0, // iOS
          borderBottomWidth: 0, // General
        },
        headerTintColor: "#fff",
        headerTitleStyle: {
          fontWeight: "bold",
        },
      }}
    >
      <Tabs.Screen
        name="home"
        options={{
          title: "Home",
          tabBarIcon: ({ size, color }) => (
            <MaterialCommunityIcons size={size} name="home" color={color} />
          ),
          headerShown: false,
        }}
      />
      <Tabs.Screen
        name="export"
        options={{
          title: "Export",
          tabBarIcon: ({ size, color }) => (
            <FontAwesome size={size} name="share" color={color} />
          ),
        }}
      />

      <Tabs.Screen
        name="profile"
        options={{
          title: "My Profile",
          tabBarIcon: ({ size, color }) => (
            <FontAwesome size={size} name="user" color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
