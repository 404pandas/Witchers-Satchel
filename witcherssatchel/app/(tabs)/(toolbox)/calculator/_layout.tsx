import { Stack } from "expo-router";

export default function CalculatorRouting() {
  return (
    <Stack>
      <Stack.Screen
        name="index"
        options={{ headerShown: false }}
      ></Stack.Screen>
      <Stack.Screen
        name="history"
        options={{ headerShown: false }}
      ></Stack.Screen>
    </Stack>
  );
}
