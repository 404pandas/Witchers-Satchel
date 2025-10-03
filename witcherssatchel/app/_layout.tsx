import { Stack, Tabs } from "expo-router";
import Ionicons from "@expo/vector-icons/Ionicons";
import FontAwesome5 from "@expo/vector-icons/FontAwesome5";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { theme } from "../theme";

export default function Routing() {
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
          title: "Talley",
          tabBarIcon: () => (
            <MaterialIcons name="library-add" size={24} color="black" />
          ),
        }}
      />
      <Tabs.Screen
        name="countdownTimer"
        options={{
          title: "Timer",
          tabBarIcon: () => <Ionicons name="timer" size={24} color="black" />,
          tabBarShowLabel: false,
        }}
      />
    </Tabs>
  );
}
