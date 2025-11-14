import { Stack } from "expo-router";

export default function TalleyRouting() {
  return (
    <Stack>
      <Stack.Screen
        name="index"
        options={{ headerShown: false }}
      ></Stack.Screen>
      <Stack.Screen
        name="talleyHistory"
        options={{
          title: "Talley",
          headerShown: false,
        }}
      ></Stack.Screen>
    </Stack>
  );
}
