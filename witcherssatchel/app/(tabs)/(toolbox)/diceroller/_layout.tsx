// /(tabs)/(toolbox)/diceroller/_layout.tsx
import { Stack } from "expo-router";
import React from "react";

export default function DiceRollerLayout() {
  return (
    <Stack
      screenOptions={{
        title: "Dice Roller",
        headerShown: false,
        animation: "slide_from_right",
        headerBackVisible: false,
        gestureEnabled: false,
      }}
    />
  );
}
