import { Stack } from "expo-router";

export default function Routing() {
  return (
    <Stack>
      <Stack.Screen name="index" options={{ title: "Satchel" }} />
      <Stack.Screen
        name="idea"
        options={{
          title: "Idea",
          presentation: "modal",
          animation: "slide_from_bottom",
        }}
      />
      <Stack.Screen name="talley" options={{ title: "Talley" }} />
    </Stack>
  );
}
