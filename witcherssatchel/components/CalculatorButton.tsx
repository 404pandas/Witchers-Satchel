import { Pressable, Text, StyleSheet } from "react-native";
import { theme } from "@/theme";

export function CalculatorButton({
  numOrOp,
  onPress,
}: {
  numOrOp: string | number;
  onPress: () => void;
}) {
  return (
    <Pressable style={styles.button} onPress={onPress}>
      <Text style={styles.text}>{numOrOp}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    margin: 6,
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
  },
  text: {
    color: theme.colorLightRed,
    fontSize: 20,
  },
});
