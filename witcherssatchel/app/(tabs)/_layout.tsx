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

  const isCountdownHistory = pathname.startsWith("/countdownTimer/history");
  const isTalleyHistory = pathname.startsWith("/talley/talleyHistory");
  const isCalculatorHistory = pathname.startsWith("/calculator/history");
  const isWeatherHistory = pathname.startsWith("/weather/history");

  return (
    <Tabs screenOptions={{ tabBarActiveTintColor: theme.colorRed }}>
      <Tabs.Screen
        name="(home)"
        options={{
          title: "Satchel",
          tabBarIcon: ({ color, size }) => {
            return <Ionicons name="bag" size={size} color={color} />;
          },
          tabBarShowLabel: false,
        }}
      />
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
        name="talley"
        options={{
          title: isTalleyHistory ? "History" : "Talley",
          headerLeft: () => {
            return (
              <Link href="/talley" asChild>
                <Pressable style={{ marginRight: 8 }} hitSlop={20}>
                  <MaterialIcons name="library-add" size={24} color="black" />
                </Pressable>
              </Link>
            );
          },
          headerRight: () => {
            return (
              <Link href="/talley/talleyHistory" asChild>
                <Pressable style={{ marginRight: 8 }} hitSlop={20}>
                  <MaterialIcons
                    name="format-list-bulleted"
                    size={24}
                    color="black"
                  />
                </Pressable>
              </Link>
            );
          },
          tabBarIcon: ({ size, color }) => (
            <MaterialIcons name="library-add" size={size} color={color} />
          ),
          tabBarShowLabel: false,
        }}
      />
      <Tabs.Screen
        name="countdownTimer"
        options={{
          title: isCountdownHistory ? "History" : "Timer",
          headerLeft: () => {
            return (
              <Link href="/countdownTimer" asChild>
                <Pressable style={{ marginRight: 8 }} hitSlop={20}>
                  <MaterialIcons name="timer" size={24} color="black" />
                </Pressable>
              </Link>
            );
          },
          headerRight: () => {
            return (
              <Link href="/countdownTimer/history" asChild>
                <Pressable style={{ marginRight: 8 }} hitSlop={20}>
                  <MaterialIcons
                    name="format-list-bulleted"
                    size={24}
                    color="black"
                  />
                </Pressable>
              </Link>
            );
          },
          tabBarIcon: ({ size, color }) => (
            <Ionicons name="timer" size={size} color={color} />
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
        name="calculator"
        options={{
          title: isCalculatorHistory ? "History" : "Calculator",
          headerLeft: () => {
            return (
              <Link href="/calculator" asChild>
                <Pressable style={{ marginRight: 8 }} hitSlop={20}>
                  <Entypo name="calculator" size={24} color="black" />
                </Pressable>
              </Link>
            );
          },
          headerRight: () => {
            return (
              <Link href="/calculator/history" asChild>
                <Pressable style={{ marginRight: 8 }} hitSlop={20}>
                  <MaterialIcons name="history" size={24} color="black" />
                </Pressable>
              </Link>
            );
          },
          tabBarIcon: ({ size, color }) => (
            <Ionicons name="calculator" size={size} color={color} />
          ),
          tabBarShowLabel: false,
        }}
      />
      <Tabs.Screen
        name="weather"
        options={{
          title: isWeatherHistory ? "History" : "Weather",
          headerLeft: () => {
            return (
              <Link href="/weather" asChild>
                <Pressable style={{ marginRight: 8 }} hitSlop={20}>
                  <Ionicons
                    name="partly-sunny-outline"
                    size={24}
                    color="black"
                  />
                </Pressable>
              </Link>
            );
          },
          headerRight: () => {
            return (
              <Link href="/weather/history" asChild>
                <Pressable style={{ marginRight: 8 }} hitSlop={20}>
                  <MaterialIcons name="history" size={24} color="black" />
                </Pressable>
              </Link>
            );
          },
          tabBarIcon: ({ size, color }) => (
            <Ionicons name="partly-sunny-outline" size={24} color="black" />
          ),
          tabBarShowLabel: false,
        }}
      />
    </Tabs>
  );
}
