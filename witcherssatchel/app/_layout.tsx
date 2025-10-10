import { Stack } from "expo-router";
import * as QuickActions from "expo-quick-actions";
import { useEffect } from "react";
import { Platform } from "react-native";
import { useQuickActionRouting } from "expo-quick-actions/router";

export default function Layout() {
  useQuickActionRouting();
  useEffect(() => {
    QuickActions.setItems([
      {
        title: "Add a potion",
        icon: Platform.OS === "ios" ? "symbol:flask" : "potion",
        id: "0",
        params: { href: "/new" },
      },
    ]);
  }, []);
  return (
    <Stack>
      <Stack.Screen
        name="(tabs)"
        options={{ headerShown: false, animation: "fade" }}
      />
      <Stack.Screen
        name="onboarding"
        options={{ headerShown: false, animation: "fade" }}
      />
      <Stack.Screen
        name="new"
        options={{ title: "New Potion", presentation: "modal" }}
      />
    </Stack>
  );
}
