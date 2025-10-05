import { Link, Tabs, usePathname } from "expo-router";
import Ionicons from "@expo/vector-icons/Ionicons";
import FontAwesome5 from "@expo/vector-icons/FontAwesome5";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { theme } from "@/theme";

export default function Routing() {
  const pathname = usePathname();
  const isCountdownHistory = pathname.startsWith("/countdownTimer/history");
  const isTalleyHistory = pathname.startsWith("/talley/talleyHistory");
  return (
    <Tabs screenOptions={{ tabBarActiveTintColor: theme.colorRed }}>
      <Tabs.Screen
        name="index"
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
                <MaterialIcons name="library-add" size={24} color="black" />
              </Link>
            );
          },
          headerRight: () => {
            return (
              <Link href="/talley/talleyHistory" asChild>
                <MaterialIcons
                  name="format-list-bulleted"
                  size={24}
                  color="black"
                />
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
                <MaterialIcons name="timer" size={24} color="black" />
              </Link>
            );
          },
          headerRight: () => {
            return (
              <Link href="/countdownTimer/history" asChild>
                <MaterialIcons
                  name="format-list-bulleted"
                  size={24}
                  color="black"
                />
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
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="person-circle" size={size} color={color} />
          ),
          tabBarShowLabel: false,
        }}
      />
    </Tabs>
  );
}
