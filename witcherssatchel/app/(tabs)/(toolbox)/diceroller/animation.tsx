// /(tabs)/(toolbox)/diceroller/animation.tsx
import React, { useEffect } from "react";
import { View, Text, StyleSheet, ScrollView } from "react-native";
import { useRouter } from "expo-router";
import { useDiceStore } from "@/store/diceRollerStore";
import { theme } from "@/theme";

export default function DiceAnimation() {
  const router = useRouter();
  const finalizeRoll = useDiceStore((s) => s.finalizeRoll);

  useEffect(() => {
    // compute the roll immediately
    finalizeRoll();

    const timer = setTimeout(() => {
      // replace so user cannot go back to animation
      router.replace("/(tabs)/(toolbox)/diceroller/result");
    }, 5000);

    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <ScrollView contentContainerStyle={theme.commonStyles.pageContainer}>
      <Text style={styles.message}>Rolling your dice...</Text>
      <Text style={styles.sub}>This will take exactly 8 seconds</Text>
      {/* TODO: add animation (spinning dice/SVG) */}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  message: {
    fontSize: 22,
    fontWeight: "700",
    marginBottom: 12,
  },
  sub: {
    fontSize: 14,
    color: theme?.colorGray ?? "#666",
  },
});
