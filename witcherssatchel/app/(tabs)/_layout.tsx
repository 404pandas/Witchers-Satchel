import { Link, Redirect, Tabs, usePathname } from "expo-router";
import Ionicons from "@expo/vector-icons/Ionicons";
import FontAwesome5 from "@expo/vector-icons/FontAwesome5";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import Entypo from "@expo/vector-icons/Entypo";

import { theme } from "@/theme";
import { useUserStore } from "@/store/userStore";

import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import { Pressable } from "react-native";

export default function Routing() {
  const pathname = usePathname();
  const hasFinishedOnboarding = useUserStore(
    (state) => state.hasFinishedOnboarding
  );

  if (!hasFinishedOnboarding) {
    return <Redirect href="/onboarding" />;
  }

  return (
    <Tabs screenOptions={{ tabBarActiveTintColor: theme.colorRed }}>
      <Tabs.Screen
        name="bestiary"
        options={{
          title: "Bestiary",
          tabBarIcon: ({ size, color }) => (
            <FontAwesome5
              name="wolf-pack-battalion"
              size={size}
              color={color}
            />
          ),
          tabBarShowLabel: false,
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: "Profile",
          headerRight: () => {
            return (
              <Link href="/new" asChild>
                <Pressable style={{ marginRight: 8 }} hitSlop={20}>
                  <MaterialCommunityIcons
                    name="flask-plus-outline"
                    size={24}
                    color="black"
                  />
                </Pressable>
              </Link>
            );
          },
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="person-circle" size={size} color={color} />
          ),
          tabBarShowLabel: false,
        }}
      />
      <Tabs.Screen
        name="signs"
        options={{
          title: "Signs",
          tabBarIcon: ({ color, size }) => (
            <MaterialIcons name="gesture" size={size} color={color} />
          ),
          tabBarShowLabel: false,
          headerShown: false,
        }}
      />

      <Tabs.Screen
        name="(toolbox)"
        options={{
          title: "Toolbox",
          tabBarIcon: ({ color, size }) => (
            <Entypo name="tools" size={size} color={color} />
          ),
          tabBarShowLabel: false,
          headerShown: false,
        }}
      />

      <Tabs.Screen
        name="encounter"
        options={{
          title: "Encounter",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="skull" size={size} color={color} />
          ),
          tabBarShowLabel: false,
          headerShown: false,
        }}
      />
    </Tabs>
  );
}
