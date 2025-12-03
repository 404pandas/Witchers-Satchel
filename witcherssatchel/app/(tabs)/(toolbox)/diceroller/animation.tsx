import React, { useEffect } from "react";
import { Text, ScrollView } from "react-native";
import { useRouter } from "expo-router";
import { useDiceStore } from "@/store/diceRollerStore";
import { theme } from "@/theme";
import LottieView from "lottie-react-native";

export default function DiceAnimation() {
  const router = useRouter();
  const finalizeRoll = useDiceStore((s) => s.finalizeRoll);

  useEffect(() => {
    finalizeRoll();

    const timer = setTimeout(() => {
      router.replace("/(tabs)/(toolbox)/diceroller/result");
    }, 2300);

    return () => clearTimeout(timer);
  }, []);

  return (
    <ScrollView contentContainerStyle={theme.commonStyles.pageContainer}>
      <Text style={theme.commonStyles.boldTitle}>Rolling your dice...</Text>
      <Text style={theme.commonStyles.scriptText}>
        This will take exactly 3 seconds
      </Text>
      <LottieView
        source={require("@/assets/animations/diceRolling.json")}
        autoPlay
        loop
        style={{ width: 250, height: 250, marginTop: 40 }}
      />
    </ScrollView>
  );
}
