import { Stack } from "expo-router";
import React from "react";

export default function GwentLayout() {
  return (
    <Stack
      screenOptions={{
        title: "Gwent Cards",
        headerShown: false,
        animation: "slide_from_right",
        headerBackVisible: false,
        gestureEnabled: false,
      }}
    />
  );
}
