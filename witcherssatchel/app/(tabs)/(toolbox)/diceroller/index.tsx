// /(tabs)/(toolbox)/diceroller/index.tsx
import React from "react";
import {
  View,
  Text,
  Pressable,
  StyleSheet,
  FlatList,
  ScrollView,
} from "react-native";
import { useRouter } from "expo-router";
import { useDiceStore, DieType, DiceSelection } from "@/store/diceRollerStore";
import { theme } from "@/theme";

const ALL_DICE: DieType[] = ["d4", "d6", "d8", "d10", "d12", "d20"];

export default function DicePicker() {
  const router = useRouter();
  const setSelectedDice = useDiceStore((s) => s.setSelectedDice);
  const selectedDice = useDiceStore((s) => s.selectedDice);

  // local editable map for amounts
  const [amounts, setAmounts] = React.useState<Record<DieType, number>>(() => {
    const init: Record<DieType, number> = {
      d4: 0,
      d6: 0,
      d8: 0,
      d10: 0,
      d12: 0,
      d20: 0,
    };
    (selectedDice || []).forEach((s) => {
      init[s.die] = s.amount;
    });
    return init;
  });

  const change = (die: DieType, delta: number) => {
    setAmounts((prev) => {
      const next = { ...prev, [die]: Math.max(0, (prev[die] || 0) + delta) };
      return next;
    });
  };

  const handleSubmit = () => {
    const selections: DiceSelection[] = ALL_DICE.map((die) => ({
      die,
      amount: amounts[die] || 0,
    })).filter((s) => s.amount > 0);

    setSelectedDice(selections);
    // Use replace to prevent building a back stack (flow enforced)
    router.replace("/(tabs)/(toolbox)/diceroller/animation");
  };

  return (
    <View style={theme.commonStyles.pageContainer}>
      <ScrollView contentContainerStyle={{ alignItems: "center" }}>
        <Text style={theme.commonStyles.boldTitle}>Pick your dice</Text>
        <View>
          <FlatList
            data={ALL_DICE}
            keyExtractor={(d) => d}
            style={{ width: "90%", marginVertical: 20 }}
            renderItem={({ item: die }) => (
              <View style={styles.row}>
                <Text
                  style={[
                    theme.commonStyles.keyName,
                    theme.commonStyles.scriptText,
                    ,
                    { marginRight: 10, paddingRight: 10 },
                  ]}
                >
                  {die.toUpperCase()}
                </Text>
                <View style={styles.controls}>
                  <Pressable
                    onPress={() => change(die, -1)}
                    style={styles.button}
                  >
                    <Text style={styles.btnText}>−</Text>
                  </Pressable>
                  <Text
                    style={[theme.commonStyles.value, { marginHorizontal: 5 }]}
                  >
                    {amounts[die]}
                  </Text>
                  <Pressable
                    onPress={() => change(die, +1)}
                    style={styles.button}
                  >
                    <Text style={styles.btnText}>+</Text>
                  </Pressable>
                </View>
              </View>
            )}
            ItemSeparatorComponent={() => <View style={styles.sep} />}
          />
          <Pressable
            style={theme.commonStyles.buttonRed}
            onPress={handleSubmit}
          >
            <Text style={theme.commonStyles.buttonText}>Roll Dice</Text>
          </Pressable>{" "}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 12,
  },
  controls: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  button: {
    padding: 8,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: theme?.colorGray ?? "#ddd",
    minWidth: 40,
    alignItems: "center",
  },
  btnText: {
    fontSize: 20,
  },
  sep: {
    height: 1,
    backgroundColor: "#eee",
  },
});
