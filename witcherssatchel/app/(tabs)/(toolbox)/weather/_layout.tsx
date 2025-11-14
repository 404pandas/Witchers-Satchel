import { Stack } from "expo-router";

export default function WeatherRouting() {
  return (
    <Stack>
      <Stack.Screen
        name="index"
        options={{ headerShown: false }}
      ></Stack.Screen>
      <Stack.Screen
        name="history"
        options={{
          title: "Weather",
          headerShown: false,
        }}
      ></Stack.Screen>
    </Stack>
  );
}
